const supabase = require("../config/supabase");
const { extractPreferredLocation, syncLeadToTelecrm } = require("../services/telecrmService");

const LOCATION_REQUIRED_SOURCES = new Set([
  "homepage-request-a-call",
  "homepage-consultation-form",
  "contact-us-page",
  "service-details-enquiry",
  "consultation-form"
]);

const createContact = async (req, res, next) => {
  try {
    const { name, email, mobile, message, service, source, enquiry_type, preferred_date, service_slug, preferredLocation } = req.body;
    const normalizedSource = source ? source.trim() : 'contact-us-page';
    const trimmedName = name ? name.trim() : '';

    // Validation
    if (!trimmedName) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    // Basic email format check
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const trimmedMobile = mobile ? mobile.trim().replace(/\s+/g, '') : "0000000000";
    const normalizedEmail = email && email.trim()
      ? email.trim().toLowerCase()
      : `${trimmedMobile || "no-mobile"}@no-email.dmc-trichology.local`;
    const resolvedPreferredLocation = extractPreferredLocation({
      preferredLocation,
      service,
      enquiryType: enquiry_type,
      message
    });

    if (LOCATION_REQUIRED_SOURCES.has(normalizedSource) && !resolvedPreferredLocation) {
      return res.status(400).json({ success: false, message: "Please select your preferred location." });
    }

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: existingLead, error: duplicateError } = await supabase
      .from('contacts')
      .select('id')
      .eq('mobile', trimmedMobile)
      .eq('source', normalizedSource)
      .gte('created_at', twoMinutesAgo)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      return res.status(500).json({ success: false, message: duplicateError.message });
    }

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a request. Please wait a moment."
      });
    }

    // Attempt to insert with full columns
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ 
        name: trimmedName, 
        email: normalizedEmail, 
        mobile: trimmedMobile, 
        message: message ? message.trim() : "No message provided.", 
        status: 'new',
        service: service ? service.trim() : (enquiry_type ? enquiry_type.trim() : null),
        enquiry_type: enquiry_type ? enquiry_type.trim() : (service ? service.trim() : null),
        preferred_date: preferred_date || null,
        service_slug: service_slug || null,
        source: normalizedSource
      }])
      .select()
      .single();

    if (error) {
      // If error is due to missing columns in DB, fall back to inserting columns inside the message field
      if (error.message.includes('preferred_date') || error.message.includes('service_slug') || error.code === '42703') {
        const formattedMsg = `[Preferred Date: ${preferred_date || 'N/A'}] [Service: ${service_slug || 'N/A'}]\n\n${message || 'No message provided.'}`;
        const { data: fbData, error: fbError } = await supabase
          .from('contacts')
          .insert([{
            name: trimmedName, 
            email: normalizedEmail, 
            mobile: trimmedMobile, 
            message: formattedMsg.trim(), 
            status: 'new',
            service: service ? service.trim() : (enquiry_type ? enquiry_type.trim() : null),
            enquiry_type: enquiry_type ? enquiry_type.trim() : (service ? service.trim() : null),
            source: normalizedSource
          }])
          .select()
          .single();

        if (fbError) return res.status(500).json({ success: false, message: fbError.message });

        syncLeadToTelecrm({
          name: trimmedName,
          mobile: trimmedMobile,
          email: normalizedEmail,
          source: normalizedSource,
          preferredLocation: resolvedPreferredLocation,
          service: service ? service.trim() : (enquiry_type ? enquiry_type.trim() : ''),
          message: formattedMsg.trim()
        }, "Contact lead").catch(() => {});
        
        return res.status(201).json({
          success: true,
          data: { ...fbData, _id: fbData.id },
        });
      }
      
      return res.status(500).json({ success: false, message: error.message });
    }

    syncLeadToTelecrm({
      name: trimmedName,
      mobile: trimmedMobile,
      email: normalizedEmail,
      source: normalizedSource,
      preferredLocation: resolvedPreferredLocation,
      service: service ? service.trim() : (enquiry_type ? enquiry_type.trim() : ''),
      message: message ? message.trim() : "No message provided."
    }, "Contact lead").catch(() => {});

    return res.status(201).json({
      success: true,
      data: { ...data, _id: data.id },
    });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' });

    if (req.query.source) {
      query = query.eq('source', req.query.source);
    } else {
      query = query.neq('source', 'service-details-enquiry');
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({ ...item, _id: item.id }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Contact not found" });

    return res.status(200).json({
      success: true,
      data: { ...data, _id: data.id },
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Contact not found" });

    return res.status(200).json({
      success: true,
      data: { ...data, _id: data.id },
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('contacts').update({ status }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Contact message not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const exportContactsCsv = async (req, res, next) => {
  try {
    let query = supabase.from('contacts').select('*');
    if (req.query.source) {
      query = query.eq('source', req.query.source);
    } else {
      query = query.neq('source', 'service-details-enquiry');
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });

    // Simplified CSV generation for API parity
    let csv = "ID,Name,Email,Mobile,Service,Message,Status,Source,CreatedAt\n";
    (data || []).forEach(row => {
      const idStr = row.id;
      const nameStr = row.name ? row.name.replace(/"/g, '""') : '';
      const emailStr = row.email ? row.email.replace(/"/g, '""') : '';
      const mobileStr = row.mobile || '';
      const serviceStr = (row.service || row.enquiry_type || "").replace(/"/g, '""');
      const msgStr = row.message ? row.message.replace(/"/g, '""') : '';
      const statusStr = row.status || 'new';
      const sourceStr = row.source || 'contact-us-page';
      const createdStr = row.created_at || '';
      
      csv += `"${idStr}","${nameStr}","${emailStr}","${mobileStr}","${serviceStr}","${msgStr}","${statusStr}","${sourceStr}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${req.query.source === 'service-details-enquiry' ? 'treatment-enquiries.csv' : 'contacts.csv'}`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

const bulkDeleteContacts = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a list of contact IDs to delete"
      });
    }

    const { error } = await supabase
      .from("contacts")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("[bulkDeleteContacts] Error:", error.message);
      return res.status(500).json({ success: false, message: "Failed to delete selected contact inquiries." });
    }

    return res.status(200).json({
      success: true,
      message: "Selected contact inquiries deleted successfully"
    });
  } catch (error) {
    console.error("Error in bulkDeleteContacts:", error);
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  updateContactStatus,
  exportContactsCsv,
  bulkDeleteContacts,
};
