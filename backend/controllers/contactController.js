const supabase = require("../config/supabase");

const createContact = async (req, res, next) => {
  try {
    const { name, email, mobile, message, service, source } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your email address." });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your mobile number." });
    }
    if (!/^\d{10}$/.test(mobile.trim().replace(/\s+/g, ''))) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    }

    const trimmedMobile = mobile.trim().replace(/\s+/g, '');

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        mobile: trimmedMobile, 
        message: message ? message.trim() : "No message provided.", 
        status: 'new',
        service: service ? service.trim() : null,
        enquiry_type: service ? service.trim() : null,
        source: source ? source.trim() : 'contact-us-page'
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

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

    const { data, count, error } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
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
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
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
    res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
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
