const supabase = require("../config/supabase");

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch Counts
    const [
      { count: totalCallbacks },
      { count: totalContacts },
      { count: todaysCallbacks },
      { count: todaysContacts },
      { count: totalAppointments },
      { count: todaysAppointments },
      { count: completedAppointments },
      { data: recentUsers }
    ] = await Promise.all([
      supabase.from('callbacks').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('callbacks').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).in('status', ['converted', 'Completed', 'completed']),
      supabase.from('users').select('*, role:roles(name)').order('created_at', { ascending: false }).limit(5)
    ]);

    // 2. Format Response for Frontend
    // Leads = Callbacks + Contacts
    const totalLeads = (totalCallbacks || 0) + (totalContacts || 0);
    const todaysLeads = (todaysCallbacks || 0) + (todaysContacts || 0);

    // Converted Leads (Assume some logic or just use completed appointments as proxy)
    const convertedLeads = completedAppointments || 0;

    const stats = {
      totalLeads,
      todaysLeads,
      convertedLeads,
      totalAppointments: totalAppointments || 0,
      todaysAppointments: todaysAppointments || 0,
      completedAppointments: completedAppointments || 0,
      recentUsers: recentUsers?.map(u => ({
        _id: u.id,
        name: u.name,
        email: u.email,
        role: u.role
      })) || []
    };

    console.log("[Dashboard Stats] Calculated Stats:", stats);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("[Dashboard Stats ERROR]:", error.message);
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
