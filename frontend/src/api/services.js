import api from "./client";

export const loginAdmin = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};

export const resetPassword = async (token, payload) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, payload);
  return data;
};

const downloadCsv = async (url, filename) => {
  const response = await api.get(url, { responseType: "blob" });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export const getServiceCategories = async (params) => {
  const { data } = await api.get("/service-categories", { params });
  return data;
};

export const createServiceCategory = async (payload) => {
  const { data } = await api.post("/service-categories", payload);
  return data;
};

export const updateServiceCategory = async (id, payload) => {
  const { data } = await api.put(`/service-categories/${id}`, payload);
  return data;
};

export const deleteServiceCategory = async (id) => {
  const { data } = await api.delete(`/service-categories/${id}`);
  return data;
};

export const toggleServiceCategoryStatus = async (id) => {
  const { data } = await api.patch(`/service-categories/${id}/toggle-status`);
  return data;
};

export const updateServiceCategoryOrder = async (id, payload) => {
  const { data } = await api.patch(`/service-categories/${id}/order`, payload);
  return data;
};

export const getSecondCategories = async (params) => {
  const { data } = await api.get("/second-categories", { params });
  return data;
};

export const createSecondCategory = async (payload) => {
  const { data } = await api.post("/second-categories", payload);
  return data;
};

export const updateSecondCategory = async (id, payload) => {
  const { data } = await api.put(`/second-categories/${id}`, payload);
  return data;
};

export const deleteSecondCategory = async (id) => {
  const { data } = await api.delete(`/second-categories/${id}`);
  return data;
};

export const toggleSecondCategoryStatus = async (id) => {
  const { data } = await api.patch(`/second-categories/${id}/toggle-status`);
  return data;
};

export const getServiceFaqs = async (params) => {
  const { data } = await api.get("/service-faqs", { params });
  return data;
};

export const createServiceFaq = async (payload) => {
  const { data } = await api.post("/service-faqs", payload);
  return data;
};

export const updateServiceFaq = async (id, payload) => {
  const { data } = await api.put(`/service-faqs/${id}`, payload);
  return data;
};

export const deleteServiceFaq = async (id) => {
  const { data } = await api.delete(`/service-faqs/${id}`);
  return data;
};

export const toggleServiceFaqStatus = async (id) => {
  const { data } = await api.patch(`/service-faqs/${id}/toggle-status`);
  return data;
};

// Blog Categories
export const getBlogCategories = async (params) => {
  const { data } = await api.get("/blog-categories", { params });
  return data;
};

export const createBlogCategory = async (payload) => {
  const { data } = await api.post("/blog-categories", payload);
  return data;
};

export const updateBlogCategory = async (id, payload) => {
  const { data } = await api.put(`/blog-categories/${id}`, payload);
  return data;
};

export const deleteBlogCategory = async (id) => {
  const { data } = await api.delete(`/blog-categories/${id}`);
  return data;
};

export const toggleBlogCategoryStatus = async (id) => {
  const { data } = await api.patch(`/blog-categories/${id}/toggle-status`);
  return data;
};

export const getResultCategories = async (params) => {
  const { data } = await api.get("/result-categories", { params });
  return data;
};

export const createResultCategory = async (payload) => {
  const { data } = await api.post("/result-categories", payload);
  return data;
};

export const updateResultCategory = async (id, payload) => {
  const { data } = await api.put(`/result-categories/${id}`, payload);
  return data;
};

export const deleteResultCategory = async (id) => {
  const { data } = await api.delete(`/result-categories/${id}`);
  return data;
};

export const toggleResultCategoryStatus = async (id) => {
  const { data } = await api.patch(`/result-categories/${id}/toggle-status`);
  return data;
};

export const updateResultCategoryOrder = async (id, payload) => {
  const { data } = await api.patch(`/result-categories/${id}/order`, payload);
  return data;
};

export const getResults = async (params) => {
  const { data } = await api.get("/results", { params });
  return data;
};

export const createResult = async (payload) => {
  const { data } = await api.post("/results", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateResult = async (id, payload) => {
  const { data } = await api.put(`/results/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteResult = async (id) => {
  const { data } = await api.delete(`/results/${id}`);
  return data;
};

export const toggleResultStatus = async (id) => {
  const { data } = await api.patch(`/results/${id}/toggle-status`);
  return data;
};

export const updateResultOrder = async (id, payload) => {
  const { data } = await api.patch(`/results/${id}/order`, payload);
  return data;
};

export const getVideoCategories = async (params) => {
  const { data } = await api.get("/video-categories", { params });
  return data;
};

export const createVideoCategory = async (payload) => {
  const { data } = await api.post("/video-categories", payload);
  return data;
};

export const updateVideoCategory = async (id, payload) => {
  const { data } = await api.put(`/video-categories/${id}`, payload);
  return data;
};

export const deleteVideoCategory = async (id) => {
  const { data } = await api.delete(`/video-categories/${id}`);
  return data;
};

export const toggleVideoCategoryStatus = async (id) => {
  const { data } = await api.patch(`/video-categories/${id}/toggle-status`);
  return data;
};

export const updateVideoCategoryOrder = async (id, payload) => {
  const { data } = await api.patch(`/video-categories/${id}/order`, payload);
  return data;
};

export const getVideos = async (params) => {
  const { data } = await api.get("/videos", { params });
  return data;
};

export const createVideo = async (payload) => {
  const { data } = await api.post("/videos", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateVideo = async (id, payload) => {
  const { data } = await api.put(`/videos/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteVideo = async (id) => {
  const { data } = await api.delete(`/videos/${id}`);
  return data;
};

export const toggleVideoStatus = async (id) => {
  const { data } = await api.patch(`/videos/${id}/toggle-status`);
  return data;
};

export const updateVideoOrder = async (id, payload) => {
  const { data } = await api.patch(`/videos/${id}/order`, payload);
  return data;
};

export const getGalleryItems = async (params) => {
  const { data } = await api.get("/gallery", { params });
  return data;
};

export const createGalleryItems = async (payload) => {
  const { data } = await api.post("/gallery", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const uploadServiceMedia = async (payload) => {
  const { data } = await api.post("/service-details/upload", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const uploadAboutTestimonialImage = async (payload) => {
  const { data } = await api.post("/about-us/upload-testimonial-image", payload);
  return data;
};

export const updateGalleryItem = async (id, payload) => {
  const { data } = await api.put(`/gallery/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteGalleryItem = async (id) => {
  const { data } = await api.delete(`/gallery/${id}`);
  return data;
};

export const toggleGalleryItemStatus = async (id) => {
  const { data } = await api.patch(`/gallery/${id}/toggle-status`);
  return data;
};

export const getTestimonials = async (params) => {
  const { data } = await api.get("/testimonials", { params });
  return data;
};

export const getTestimonialById = async (id) => {
  const { data } = await api.get(`/testimonials/${id}`);
  return data;
};

export const createTestimonial = async (payload) => {
  const { data } = await api.post("/testimonials", payload);
  return data;
};

export const updateTestimonial = async (id, payload) => {
  const { data } = await api.put(`/testimonials/${id}`, payload);
  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};

export const toggleTestimonialStatus = async (id) => {
  const { data } = await api.patch(`/testimonials/${id}/toggle-status`);
  return data;
};

export const getCallbacks = async (params) => {
  const { data } = await api.get("/callbacks", { params });
  return data;
};

export const updateCallbackStatus = async (id, payload) => {
  const { data } = await api.patch(`/callbacks/${id}/status`, payload);
  return data;
};

export const deleteCallback = async (id) => {
  const { data } = await api.delete(`/callbacks/${id}`);
  return data;
};

export const bulkDeleteCallbacks = async (payload) => {
  const { data } = await api.post("/callbacks/bulk-delete", payload);
  return data;
};

export const exportCallbacksCsv = async (params) => {
  const queryStr = params ? new URLSearchParams(params).toString() : "";
  return downloadCsv(`/callbacks/export/csv${queryStr ? `?${queryStr}` : ""}`, "callback-leads.csv");
};

export const getContacts = async (params) => {
  const { data } = await api.get("/contact", { params });
  return data;
};

export const updateContact = async (id, payload) => {
  const { data } = await api.put(`/contact/${id}`, payload);
  return data;
};

export const deleteContact = async (id) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};

export const bulkDeleteContacts = async (payload) => {
  const { data } = await api.post("/contact/bulk-delete", payload);
  return data;
};

export const exportContactsCsv = async () => downloadCsv("/contact/export/csv", "contact-leads.csv");

export const getAppointments = async (params) => {
  const { data } = await api.get("/appointment", { params });
  return data;
};

export const updateAppointment = async (id, payload) => {
  const { data } = await api.put(`/appointment/${id}`, payload);
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await api.delete(`/appointment/${id}`);
  return data;
};

export const bulkDeleteAppointments = async (payload) => {
  const { data } = await api.post("/appointment/bulk-delete", payload);
  return data;
};

export const exportAppointmentsCsv = async (params) => {
  const queryStr = params ? new URLSearchParams(params).toString() : "";
  return downloadCsv(`/appointment/export${queryStr ? `?${queryStr}` : ""}`, "appointment-leads.csv");
};

export const getNewsletterSubscribers = async (params) => {
  const { data } = await api.get("/newsletter", { params });
  return data;
};

export const deleteNewsletterSubscriber = async (id) => {
  const { data } = await api.delete(`/newsletter/${id}`);
  return data;
};

export const bulkDeleteNewsletterSubscribers = async (payload) => {
  const { data } = await api.post("/newsletter/bulk-delete", payload);
  return data;
};

export const exportNewsletterSubscribersCsv = async (params) => {
  const queryStr = params ? new URLSearchParams(params).toString() : "";
  return downloadCsv(`/newsletter/export/csv${queryStr ? `?${queryStr}` : ""}`, "newsletter-subscribers.csv");
};

export const getServicesMaster = async () => {
  const { data } = await api.get("/services");
  return data;
};

export const getUsers = async (params) => {
  const { data } = await api.get("/users", { params });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (payload) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const toggleUserStatus = async (id) => {
  const { data } = await api.patch(`/users/${id}/toggle-status`);
  return data;
};

export const getRoles = async () => {
  const { data } = await api.get("/roles");
  return data;
};

export const createRole = async (payload) => {
  const { data } = await api.post("/roles", payload);
  return data;
};

export const updateRole = async (id, payload) => {
  const { data } = await api.put(`/roles/${id}`, payload);
  return data;
};

export const deleteRole = async (id) => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};

export const getMenus = async () => {
  const { data } = await api.get("/menus");
  return data;
};

export const createMenu = async (payload) => {
  const { data } = await api.post("/menus", payload);
  return data;
};

export const updateMenu = async (id, payload) => {
  const { data } = await api.put(`/menus/${id}`, payload);
  return data;
};

export const deleteMenu = async (id) => {
  const { data } = await api.delete(`/menus/${id}`);
  return data;
};

export const toggleMenuStatus = async (id) => {
  const { data } = await api.patch(`/menus/${id}/toggle-status`);
  return data;
};

export const updateMenuOrder = async (id, payload) => {
  const { data } = await api.patch(`/menus/${id}/order`, payload);
  return data;
};

export const getOperations = async () => {
  const { data } = await api.get("/operations");
  return data;
};

export const createOperation = async (payload) => {
  const { data } = await api.post("/operations", payload);
  return data;
};

export const updateOperation = async (id, payload) => {
  const { data } = await api.put(`/operations/${id}`, payload);
  return data;
};

export const deleteOperation = async (id) => {
  const { data } = await api.delete(`/operations/${id}`);
  return data;
};

export const toggleOperationStatus = async (id) => {
  const { data } = await api.patch(`/operations/${id}/toggle-status`);
  return data;
};

export const getMenuOperations = async () => {
  const { data } = await api.get("/menu-operations");
  return data;
};

export const createMenuOperation = async (payload) => {
  const { data } = await api.post("/menu-operations", payload);
  return data;
};

export const updateMenuOperation = async (id, payload) => {
  const { data } = await api.put(`/menu-operations/${id}`, payload);
  return data;
};

export const deleteMenuOperation = async (id) => {
  const { data } = await api.delete(`/menu-operations/${id}`);
  return data;
};

// ========================
// ✅ SEO & Leads
// ========================

// Redirects
export const getRedirects = async (params) => {
  const { data } = await api.get("/redirects", { params });
  return data;
};

export const createRedirect = async (payload) => {
  const { data } = await api.post("/redirects", payload);
  return data;
};

export const updateRedirect = async (id, payload) => {
  const { data } = await api.put(`/redirects/${id}`, payload);
  return data;
};

export const deleteRedirect = async (id) => {
  const { data } = await api.delete(`/redirects/${id}`);
  return data;
};

export const toggleRedirectStatus = async (id) => {
  const { data } = await api.patch(`/redirects/${id}/status`);
  return data;
};

// Sitemap
export const getSitemapEntries = async () => {
  const { data } = await api.get("/seo/sitemap");
  return data;
};

export const createSitemapEntry = async (payload) => {
  const { data } = await api.post("/seo/sitemap", payload);
  return data;
};

export const deleteSitemapEntry = async (id) => {
  const { data } = await api.delete(`/seo/sitemap/${id}`);
  return data;
};

export const getSitemapXml = async () => {
  const { data } = await api.get("/seo/sitemap/xml");
  return data;
};

// Robots
export const getRobotsContent = async () => {
  const { data } = await api.get("/seo/robots");
  return data;
};

export const updateRobotsContent = async (payload) => {
  const { data } = await api.put("/seo/robots", payload);
  return data;
};
