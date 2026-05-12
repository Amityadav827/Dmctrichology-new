import BlogHero from '../../components/BlogHero';
import BlogListing from '../../components/BlogListing';
import { fetchBlogPage, fetchBlogs } from '../../services/api';
import '../service.css';

export const metadata = {
  title: 'Blog | DMC Trichology',
  description: 'Stay updated with the latest hair transplant and skin care news, tips, and wellness advice from our experts.',
};

async function getPageData() {
  const [pageRes, blogsRes] = await Promise.all([
    fetchBlogPage(),
    fetchBlogs({ status: 'Published' })
  ]);
  
  return {
    pageSettings: pageRes?.data || {},
    blogs: blogsRes?.data || []
  };
}

export default async function BlogPage() {
  const { pageSettings, blogs } = await getPageData();

  return (
    <div className="bg-white min-h-screen">
      <BlogHero data={pageSettings.hero} />
      <BlogListing data={pageSettings} blogs={blogs} />
    </div>
  );
}

