import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-5">
      <div className="max-w-2xl mx-auto text-center">
        <h1 
          className="text-[120px] font-bold leading-none mb-4"
          style={{ 
            fontFamily: "'Marcellus', serif",
            background: 'linear-gradient(135deg, #E4B753 0%, #3B5998 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          404
        </h1>
        <h2 
          className="text-4xl text-[#111] mb-6"
          style={{ fontFamily: "'Marcellus', serif" }}
        >
          Service Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-10" style={{ fontFamily: "'Lato', sans-serif" }}>
          We're sorry, but the service you are looking for doesn't exist or has been moved. 
          Please check our available services to find what you need.
        </p>
        <Link 
          href="/service"
          className="inline-flex items-center justify-center px-10 py-4 bg-[#3B5998] text-white rounded-full font-semibold transition-all hover:bg-[#E4B753] hover:scale-105"
          style={{ fontFamily: "'Marcellus', serif" }}
        >
          Back to All Services
        </Link>
      </div>
    </div>
  );
}
