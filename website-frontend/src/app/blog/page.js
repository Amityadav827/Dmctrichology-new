import BlogHero from '../../components/BlogHero';
import BlogListing from '../../components/BlogListing';
import { fetchBlogPage, fetchBlogs } from '../../services/api';
import '../service.css';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Blog | DMC Trichology',
  description: 'Stay updated with the latest hair transplant and skin care news, tips, and wellness advice from our experts.',
};

async function getPageData() {
  console.log("[BlogPage] Fetching data...");
  const [pageRes, blogsRes] = await Promise.all([
    fetchBlogPage(),
    fetchBlogs({ status: 'Published' })
  ]);
  
  console.log("[BlogPage] API Responses:", { 
    pageSuccess: !!pageRes?.data, 
    blogsCount: blogsRes?.data?.length || 0 
  });

  return {
    pageSettings: pageRes?.data || {},
    blogs: blogsRes?.data || []
  };
}

export default async function BlogPage() {
  const { pageSettings, blogs } = await getPageData();
  console.log("[BlogPage] Rendering with blogs count:", blogs.length);

  return (
    <div className="bg-white min-h-screen">
      <BlogHero data={pageSettings.hero} />
      <BlogListing data={pageSettings} blogs={blogs} />
    </div>
  );
}

