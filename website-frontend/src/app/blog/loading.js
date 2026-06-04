import '../blog-detail.css';

export default function BlogLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="skeleton skeleton-banner"></div>
      <section className="blog-listing-wrapper">
        <div className="blog-container">
          <div className="blog-grid-content">
            <div className="blog-grid">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="blog-card">
                  <div className="blog-card-image skeleton"></div>
                  <div className="skeleton skeleton-meta"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text" style={{ width: '35%' }}></div>
                </div>
              ))}
            </div>
          </div>
          <aside className="blog-sidebar">
            <div className="sidebar-inner">
              <div className="skeleton skeleton-sidebar-card"></div>
              <div className="skeleton skeleton-sidebar-card"></div>
              <div className="skeleton skeleton-sidebar-card"></div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
