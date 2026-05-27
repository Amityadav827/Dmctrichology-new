const supabase = require('../config/supabase');

const createLead = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your email address." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your mobile number." });
    }
    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: "Please select an appointment date." });
    }

    // Duplicate prevention (spam filter: duplicate mobile in last 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('science_consultation_leads')
      .select('id')
      .eq('mobile', trimmedMobile)
      .gte('created_at', twoMinutesAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a request. Please wait a moment."
      });
    }

    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: trimmedMobile,
        service: service ? service.trim() : "Hair Restoration",
        appointment_date: new Date(appointmentDate).toISOString(),
        message: message ? message.trim() : "",
        status: "new"
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error("Error in createLead:", error);
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('science_consultation_leads')
      .select('*', { count: 'exact' });

    if (req.query.search) {
      const s = req.query.search.trim();
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%,service.ilike.%${s}%`);
    }

    if (req.query.status) {
      query = query.eq('status', req.query.status.trim());
    }

    if (req.query.startDate) {
      query = query.gte('created_at', new Date(req.query.startDate).toISOString());
    }
    if (req.query.endDate) {
      query = query.lte('created_at', new Date(`${req.query.endDate}T23:59:59.999Z`).toISOString());
    }

    const sortBy = req.query.sortBy === 'appointmentDate' ? 'appointment_date' : 'created_at';
    const ascending = req.query.sortOrder === 'asc';
    query = query.order(sortBy, { ascending }).range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;
    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error in getLeads:", error);
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) {
      return res.status(404).json({ success: false, message: "Science lead not found" });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Error in getLeadById:", error);
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, service } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (service) updates.service = service;

    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) {
      return res.status(404).json({ success: false, message: "Science lead not found" });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Error in updateLeadStatus:", error);
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) {
      return res.status(404).json({ success: false, message: "Science lead not found" });
    }
    return res.status(200).json({ success: true, message: "Science lead deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLead:", error);
    next(error);
  }
};

const bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a list of lead IDs to delete"
      });
    }

    const { error } = await supabase
      .from('science_consultation_leads')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Selected Science leads deleted successfully"
    });
  } catch (error) {
    console.error("Error in bulkDeleteLeads:", error);
    next(error);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    let query = supabase
      .from('science_consultation_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (req.query.search) {
      const s = req.query.search.trim();
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%,service.ilike.%${s}%`);
    }
    if (req.query.status) {
      query = query.eq('status', req.query.status.trim());
    }
    if (req.query.startDate) {
      query = query.gte('created_at', new Date(req.query.startDate).toISOString());
    }
    if (req.query.endDate) {
      query = query.lte('created_at', new Date(`${req.query.endDate}T23:59:59.999Z`).toISOString());
    }

    const { data: leads, error } = await query;
    if (error) throw error;

    let csv = "ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n";
    leads.forEach(row => {
      const apptDateStr = row.appointment_date ? new Date(row.appointment_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row.id}","${(row.name || '').replace(/"/g, '""')}","${row.email}","${row.mobile}","${(row.service || '').replace(/"/g, '""')}","${apptDateStr}","${row.status}","${(row.notes || '').replace(/"/g, '""')}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=science-consultation-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error in exportCsv:", error);
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  bulkDeleteLeads,
  exportCsv
};
