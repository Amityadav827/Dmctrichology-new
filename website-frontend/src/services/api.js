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
