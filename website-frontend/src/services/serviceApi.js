import axios from 'axios';

const isLocal = process.env.NODE_ENV === 'development';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || (isLocal ? 'http://localhost:10000/api' : 'https://dmctrichology-1.onrender.com/api'),
});

export const fetchServicePageSettings = async () => {
  try {
    const res = await api.get(`/service-page-settings?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching service page settings', error);
    return null;
  }
};

export const fetchServiceListingCards = async () => {
  try {
    const res = await api.get(`/service-listing-cards?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching service cards', error);
    return null;
  }
};

export const fetchServiceListingCategories = async () => {
  try {
    const res = await api.get(`/service-listing-categories?t=${Date.now()}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching service categories', error);
    return null;
  }
};

export default api;
