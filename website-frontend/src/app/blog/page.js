import BlogHero from '../../components/BlogHero';
import BlogListing from '../../components/BlogListing';
import { fetchBlogPage, fetchBlogs } from '../../services/api';
import '../service.css';
import '../blog-detail.css';

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Blog | DMC Trichology',
  description: 'Stay updated with the latest hair transplant and skin care news, tips, and wellness advice from our experts.',
};

const getPositiveNumber = (value, fallback) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

async function getPageData(searchParams = {}) {
  const currentPage = getPositiveNumber(searchParams.page, 1);
  const search = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search;
  const categoryId = Array.isArray(searchParams.categoryId) ? searchParams.categoryId[0] : searchParams.categoryId;

  const blogParams = {
    status: 'Published',
    page: currentPage,
    limit: 10,
    ...(search ? { search } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [pageRes, blogsRes, recentBlogsRes] = await Promise.all([
    fetchBlogPage(),
    fetchBlogs(blogParams),
    fetchBlogs({ status: 'Published', page: 1, limit: 4 })
  ]);

  return {
    pageSettings: pageRes?.data || {},
    blogs: blogsRes?.blogs || blogsRes?.data || [],
    recentBlogs: recentBlogsRes?.blogs || recentBlogsRes?.data || [],
    pagination: {
      totalBlogs: blogsRes?.totalBlogs ?? blogsRes?.pagination?.total ?? 0,
      totalPages: blogsRes?.totalPages ?? blogsRes?.pagination?.totalPages ?? 1,
      currentPage: blogsRes?.currentPage ?? blogsRes?.pagination?.page ?? currentPage,
      hasNextPage: blogsRes?.hasNextPage ?? blogsRes?.pagination?.hasNextPage ?? false,
      hasPreviousPage: blogsRes?.hasPreviousPage ?? blogsRes?.pagination?.hasPreviousPage ?? false,
    },
    initialFilters: {
      search: search || '',
      categoryId: categoryId || 'All',
    },
  };
}

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { pageSettings, blogs, recentBlogs, pagination, initialFilters } = await getPageData(resolvedSearchParams || {});

  return (
    <div className="bg-white min-h-screen">
      <BlogHero data={pageSettings.hero} />
      <BlogListing
        data={pageSettings}
        blogs={blogs}
        recentBlogs={recentBlogs}
        pagination={pagination}
        initialFilters={initialFilters}
      />
    </div>
  );
}

