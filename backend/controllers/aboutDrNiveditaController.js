const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');
const { syncLeadToTelecrm } = require('../services/telecrmService');

const CMS_KEY = 'about_dr_nivedita';

// Standard fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    backgroundImage: '',
    mainImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI',
    doctorName: 'Dr. Nivedita Dadu',
    degreeText: 'MBBS, MD (Dermatology)',
    descriptionParagraph: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Schedule Your Visit',
    backgroundColor: '#3b5998',
    overlayOpacity: 0.45
  }
};

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!row) {
      return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
    }
    return res.status(200).json({ success: true, data: row.data || {} });
  } catch (error) {
    console.error('Error fetching Dr. Nivedita page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: req.body, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;
    return res.status(200).json({ success: true, data: req.body, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating Dr. Nivedita page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const publicUrl = await uploadToSupabase(req.file, 'dr_nivedita_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Dr. Nivedita asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ISOLATED LEADS API (science_consultation_leads table)
// ==========================================

exports.createLead = async (req, res, next) => {
  try {
    const { name, mobile, service, email, preferredLocation, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your mobile number.' });
    }

    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }

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
        message: 'You have already submitted a consultation request. Please wait a moment.'
      });
    }

    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .insert({
        name: name.trim(),
        mobile: trimmedMobile,
        service: service ? service.trim() : 'Dr. Nivedita Dadu Consultation',
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;

    syncLeadToTelecrm({
      name: lead.name,
      mobile: lead.mobile,
      email: email && email.trim() ? email.trim().toLowerCase() : '',
      preferredLocation,
      service: lead.service || 'Dr. Nivedita Dadu Consultation',
      message: message || '',
      source: 'Dr. Nivedita Consultation Form'
    }, 'Dr. Nivedita lead').catch(() => {});

    return res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully in Dr. Nivedita leads'
    });
  } catch (error) {
    console.error('Error creating Dr. Nivedita lead:', error);
    next(error);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = supabase.from('science_consultation_leads').select('*', { count: 'exact' });

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
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
    });
  } catch (error) {
    console.error('Error fetching Dr. Nivedita leads:', error);
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching single lead:', error);
    next(error);
  }
};

exports.updateLeadStatus = async (req, res, next) => {
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
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead status:', error);
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    next(error);
  }
};

exports.bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid lead IDs to delete' });
    }
    const { error } = await supabase
      .from('science_consultation_leads')
      .delete()
      .in('id', ids);
    if (error) throw error;
    return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    next(error);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    let query = supabase.from('science_consultation_leads').select('*').order('created_at', { ascending: false });

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

    let csv = 'ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n';
    leads.forEach(row => {
      const apptDateStr = row.appointment_date ? new Date(row.appointment_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row.id}","${(row.name || '').replace(/"/g, '""')}","${row.email}","${row.mobile}","${(row.service || '').replace(/"/g, '""')}","${apptDateStr}","${row.status}","${(row.notes || '').replace(/"/g, '""')}","${createdStr}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dr-nivedita-leads.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    next(error);
  }
};
