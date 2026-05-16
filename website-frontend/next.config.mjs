/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dmctrichology-1.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fxzkbhhinbjbeegkjnae.supabase.co',
        pathname: '/**',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
