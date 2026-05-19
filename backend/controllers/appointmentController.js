const supabase = require("../config/supabase");

const createAppointment = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

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
    if (!service || !service.trim()) {
      return res.status(400).json({ success: false, message: "Please select a type of service enquiry." });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: "Please select an appointment date and time." });
    }

    const trimmedMobile = mobile.trim().replace(/\s+/g, '');

    // Check for duplicate submissions in the last 2 minutes (prevent spam)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    
    const { data: existing, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("mobile", trimmedMobile)
      .gte("created_at", twoMinutesAgo)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error("[createAppointment] Check Error:", checkError.message);
      return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a request. Please wait a moment."
      });
    }

    const { data: appointment, error: insertError } = await supabase
      .from("appointments")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: trimmedMobile,
          service: service.trim(),
          appointment_date: new Date(appointmentDate).toISOString(),
          message: message ? message.trim() : "",
          status: "new",
          notes: ""
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("[createAppointment] Insert Error:", insertError.message);
      return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }

    return res.status(201).json({
      success: true,
      data: {
        ...appointment,
        _id: appointment.id,
        appointmentDate: appointment.appointment_date,
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at
      }
    });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = supabase
      .from("appointments")
      .select("*", { count: "exact" });

    // 1. Live search filter
    if (req.query.search) {
      const searchVal = `%${req.query.search.trim()}%`;
      query = query.or(`name.ilike.${searchVal},email.ilike.${searchVal},mobile.ilike.${searchVal}`);
    }

    // 2. Status filter
    if (req.query.status) {
      query = query.eq("status", req.query.status.trim());
    }

    // 3. Date range filter
    if (req.query.startDate) {
      query = query.gte("created_at", new Date(req.query.startDate).toISOString());
    }
    if (req.query.endDate) {
      const end = `${req.query.endDate}T23:59:59.999Z`;
      query = query.lte("created_at", new Date(end).toISOString());
    }

    // 4. Sort order
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const isAscending = sortOrder === "asc";
    const sortByField = sortBy === "appointmentDate" ? "appointment_date" : "created_at";

    query = query
      .order(sortByField, { ascending: isAscending })
      .range(skip, skip + limit - 1);

    const { data: appointments, count, error } = await query;

    if (error) {
      console.error("[getAppointments] Query Error:", error.message);
      return res.status(500).json({ success: false, message: "Failed to retrieve appointments." });
    }

    const formattedData = (appointments || []).map(item => ({
      ...item,
      _id: item.id,
      appointmentDate: item.appointment_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in getAppointments:", error);
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const { data: appointment, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !appointment) {
      return res.status(404).json({ success: false, message: "Appointment request not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...appointment,
        _id: appointment.id,
        appointmentDate: appointment.appointment_date,
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at
      }
    });
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    updates.updated_at = new Date().toISOString();

    const { data: appointment, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !appointment) {
      return res.status(404).json({ success: false, message: "Appointment request not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...appointment,
        _id: appointment.id,
        appointmentDate: appointment.appointment_date,
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at
      }
    });
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { data: appointment, error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error || !appointment) {
      return res.status(404).json({ success: false, message: "Appointment request not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    next(error);
  }
};

const bulkDeleteAppointments = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a list of appointment IDs to delete"
      });
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("[bulkDeleteAppointments] Error:", error.message);
      return res.status(500).json({ success: false, message: "Failed to delete selected appointments." });
    }

    return res.status(200).json({
      success: true,
      message: "Selected appointment requests deleted successfully"
    });
  } catch (error) {
    console.error("Error in bulkDeleteAppointments:", error);
    next(error);
  }
};

const exportAppointmentsCsv = async (req, res, next) => {
  try {
    let query = supabase
      .from("appointments")
      .select("*");

    // Apply exact same search / status / date range filters on export
    if (req.query.search) {
      const searchVal = `%${req.query.search.trim()}%`;
      query = query.or(`name.ilike.${searchVal},email.ilike.${searchVal},mobile.ilike.${searchVal}`);
    }
    if (req.query.status) {
      query = query.eq("status", req.query.status.trim());
    }
    if (req.query.startDate) {
      query = query.gte("created_at", new Date(req.query.startDate).toISOString());
    }
    if (req.query.endDate) {
      const end = `${req.query.endDate}T23:59:59.999Z`;
      query = query.lte("created_at", new Date(end).toISOString());
    }

    query = query.order("created_at", { ascending: false });

    const { data: appointments, error } = await query;

    if (error) {
      console.error("[exportAppointmentsCsv] Error:", error.message);
      return res.status(500).json({ success: false, message: "Failed to export CSV." });
    }

    let csv = "ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n";
    (appointments || []).forEach(row => {
      const idStr = row.id;
      const nameStr = row.name.replace(/"/g, '""');
      const emailStr = row.email.replace(/"/g, '""');
      const serviceStr = row.service.replace(/"/g, '""');
      const notesStr = (row.notes || "").replace(/"/g, '""');
      
      const apptDateStr = row.appointment_date ? new Date(row.appointment_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      
      csv += `"${idStr}","${nameStr}","${emailStr}","${row.mobile}","${serviceStr}","${apptDateStr}","${row.status}","${notesStr}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=appointments.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error in exportAppointmentsCsv:", error);
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  bulkDeleteAppointments,
  exportAppointmentsCsv,
};

