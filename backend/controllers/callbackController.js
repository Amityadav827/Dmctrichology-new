const supabase = require("../config/supabase");
const { sendLeadToTelecrm } = require("../services/telecrmService");

// Helper to map DB status to Frontend status
const mapDbToFrontendStatus = (status) => {
  if (status === 'called') return 'contacted';
  if (status === 'completed') return 'converted';
  return status; // 'new'
};

// Helper to map Frontend status to DB status
const mapFrontendToDbStatus = (status) => {
  if (status === 'contacted') return 'called';
  if (status === 'converted') return 'completed';
  return status; // 'new'
};

const createCallback = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide both name and mobile number",
      });
    }

    const { data, error } = await supabase
      .from('callbacks')
      .insert([{ name, mobile, status: 'new' }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

    sendLeadToTelecrm({
      name: data.name,
      mobile: data.mobile,
      source: "Homepage Callback Form"
    }).catch((crmError) => {
      console.error("TeleCRM callback lead sync failed:", crmError.response?.data || crmError.message);
    });

    return res.status(201).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        createdAt: data.created_at,
        status: mapDbToFrontendStatus(data.status)
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCallbacks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = supabase
      .from('callbacks')
      .select('*', { count: 'exact' });

    // 1. Live search filter
    if (req.query.search) {
      const searchVal = `%${req.query.search}%`;
      query = query.or(`name.ilike.${searchVal},mobile.ilike.${searchVal}`);
    }

    // 2. Status filter
    if (req.query.status) {
      const dbStatus = mapFrontendToDbStatus(req.query.status);
      query = query.eq('status', dbStatus);
    }

    // 3. Date range filter
    if (req.query.startDate) {
      query = query.gte('created_at', req.query.startDate);
    }
    if (req.query.endDate) {
      // Set to the end of that day (23:59:59)
      const end = `${req.query.endDate}T23:59:59.999Z`;
      query = query.lte('created_at', end);
    }

    // 4. Order by created_at desc
    query = query.order('created_at', { ascending: false });

    // 5. Pagination range
    const { data, count, error } = await query.range(skip, skip + limit - 1);

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({
      ...item,
      _id: item.id,
      createdAt: item.created_at,
      status: mapDbToFrontendStatus(item.status)
    }));

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

const deleteCallback = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: "Lead ID is required" });
    }

    const { error } = await supabase.from('callbacks').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({
      success: true,
      message: "Callback request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const bulkDeleteCallbacks = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a list of lead IDs to delete"
      });
    }

    const { error } = await supabase
      .from('callbacks')
      .delete()
      .in('id', ids);

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(200).json({
      success: true,
      message: "Selected callback leads deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

const updateCallbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const dbStatus = mapFrontendToDbStatus(status);
    const { data, error } = await supabase
      .from('callbacks')
      .update({ status: dbStatus })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Callback request not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        createdAt: data.created_at,
        status: mapDbToFrontendStatus(data.status)
      }
    });
  } catch (error) {
    next(error);
  }
};

const exportCallbacksCsv = async (req, res, next) => {
  try {
    let query = supabase.from('callbacks').select('*');

    // Apply exact same active filters on export
    if (req.query.search) {
      const searchVal = `%${req.query.search}%`;
      query = query.or(`name.ilike.${searchVal},mobile.ilike.${searchVal}`);
    }
    if (req.query.status) {
      const dbStatus = mapFrontendToDbStatus(req.query.status);
      query = query.eq('status', dbStatus);
    }
    if (req.query.startDate) {
      query = query.gte('created_at', req.query.startDate);
    }
    if (req.query.endDate) {
      const end = `${req.query.endDate}T23:59:59.999Z`;
      query = query.lte('created_at', end);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });

    let csv = "ID,Name,Mobile,Status,CreatedAt\n";
    data.forEach(row => {
      const statusLabel = row.status === 'called' ? 'Contacted' : (row.status === 'completed' ? 'Converted' : 'New');
      const dateStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row.id}","${row.name.replace(/"/g, '""')}","${row.mobile}","${statusLabel}","${dateStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=callbacks.csv");
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCallback,
  getCallbacks,
  deleteCallback,
  bulkDeleteCallbacks,
  updateCallbackStatus,
  exportCallbacksCsv,
};
