import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://dmctrichology-1.onrender.com/api',
});

export const fetchSiteSettings = async () => {
  try {
    const res = await api.get('/site-settings');
    return res.data;
  } catch (error) {
    console.error('Error fetching site settings', error);
    return null;
  }
};

export const fetchTopBar = async () => {
  try {
    const res = await api.get(`/topbar?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching topbar', error);
    return null;
  }
};

export const fetchHeader = async () => {
  try {
    const res = await api.get(`/header?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching header', error);
    return null;
  }
};

export const fetchMenu = async () => {
  try {
    const res = await api.get('/menu');
    return res.data;
  } catch (error) {
    console.error('Error fetching menu', error);
    return null;
  }
};

export const fetchHeroSlides = async () => {
  try {
    const res = await api.get('/hero');
    return res.data;
  } catch (error) {
    console.error('Error fetching hero slides', error);
    return null;
  }
};

export const fetchAboutUs = async () => {
  try {
    const res = await api.get(`/about-us?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching about us data', error);
    return null;
  }
};

export const fetchServices = async () => {
  try {
    const res = await api.get(`/services?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching services data', error);
    return null;
  }
};

export const fetchMarqueeFeatures = async () => {
  try {
    const res = await api.get(`/marquee-features?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching marquee features', error);
    return null;
  }
};

export const fetchWhyChooseUs = async () => {
  try {
    const res = await api.get(`/why-choose-us?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching why choose us', error);
    return null;
  }
};

export const fetchResultsSlider = async () => {
  try {
    const res = await api.get(`/results-slider?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching results slider', error);
    return null;
  }
};

export const fetchGradeSlider = async () => {
  try {
    const res = await api.get(`/grade-slider?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching grade slider', error);
    return null;
  }
};

export const fetchWhyChooseDMC = async () => {
  try {
    const res = await api.get(`/why-choose-dmc?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching why choose dmc', error);
    return null;
  }
};

export const fetchSurgeons = async () => {
  try {
    const res = await api.get(`/surgeons?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching surgeons', error);
    return null;
  }
};

export const fetchConsultation = async () => {
  try {
    const res = await api.get(`/consultation?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching consultation', error);
    return null;
  }
};

export const fetchReviews = async () => {
  try {
    const res = await api.get(`/reviews?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching reviews', error);
    return null;
  }
};

export const fetchTreatmentPlan = async () => {
  try {
    const res = await api.get(`/treatment-plan?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching treatment plan', error);
    return null;
  }
};

export const fetchHomeFAQ = async () => {
  try {
    const res = await api.get(`/home-faq?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching home faq', error);
    return null;
  }
};

export const fetchHomeBlog = async () => {
  try {
    const res = await api.get(`/blogs-home?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching blogs home', error);
    return null;
  }
};

export const fetchPressMedia = async () => {
  try {
    const res = await api.get(`/press-media?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching press media', error);
    return null;
  }
};

export const fetchFooter = async () => {
  try {
    const res = await api.get(`/footer?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching footer', error);
    return null;
  }
};

export const fetchBlogs = async (params) => {
  try {
    const res = await api.get('/blogs', { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching blogs', error);
    return null;
  }
};

export const fetchBlogBySlug = async (slug) => {
  try {
    const res = await api.get(`/blogs/slug/${slug}?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching blog by slug', error);
    return null;
  }
};

export const fetchBlogCategories = async () => {
  try {
    const res = await api.get('/blog-categories');
    return res.data;
  } catch (error) {
    console.error('Error fetching blog categories', error);
    return null;
  }
};

export const fetchBlogPage = async () => {
  try {
    const res = await api.get(`/blog-page?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching blog page data', error);
    return null;
  }
};


export const submitLead = async (data) => {
  try {
    const res = await api.post('/lead', data);
    return res.data;
  } catch (error) {
    console.error('Error submitting lead', error);
    throw error;
  }
};

export default api;
