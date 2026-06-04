import Link from 'next/link';

const hasText = (value) => String(value || '').trim().length > 0;

function OurTeamHero({ data = {} }) {
  if (data.isEnabled === false) return null;
  const pageTitle = data.pageTitle || 'Our Team';
  const breadcrumbLabel = data.breadcrumbLabel || 'Our Team';
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.62;
  const style = data.backgroundImage ? { backgroundImage: `url(${data.backgroundImage})` } : {};

  return (
    <section className="our-team-hero" style={style}>
      <div className="our-team-hero-overlay" style={{ opacity: overlayOpacity }} />
      <div className="our-team-hero-inner">
        <h1>{pageTitle}</h1>
        <div className="our-team-breadcrumb">
          <Link href="/">Home</Link>
          <span>→</span>
          <span>{breadcrumbLabel}</span>
        </div>
      </div>
    </section>
  );
}

function TeamMembersSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const members = Array.isArray(data.members)
    ? [...data.members].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    : [];

  if (members.length === 0) return null;

  return (
    <section className="our-team-members">
      <div className="our-team-members-grid">
        {members.map((member, index) => {
          const CardContent = (
            <>
              <div className="our-team-portrait">
                {hasText(member.image) ? (
                  <img src={member.image} alt={member.name || 'DMC team member'} />
                ) : (
                  <span>{String(member.name || 'DMC').slice(0, 1)}</span>
                )}
              </div>
              <div className="our-team-card-content">
                {hasText(member.name) && <h2>{member.name}</h2>}
                {hasText(member.designation) && <p className="our-team-designation">{member.designation}</p>}
                {hasText(member.qualification) && <p className="our-team-qualification">{member.qualification}</p>}
                {hasText(member.shortDescription) && <p className="our-team-description">{member.shortDescription}</p>}
              </div>
            </>
          );

          return member.profileLink ? (
            <Link className="our-team-card" href={member.profileLink} key={`${member.name}-${index}`}>
              {CardContent}
            </Link>
          ) : (
            <article className="our-team-card" key={`${member.name}-${index}`}>
              {CardContent}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function OurTeamPage({ data = {} }) {
  return (
    <main className="our-team-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .our-team-page {
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .our-team-hero {
          position: relative;
          min-height: 430px;
          padding: 170px 5% 92px;
          background-color: #3B5998;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .our-team-hero-overlay {
          position: absolute;
          inset: 0;
          background: #000000;
          z-index: 1;
          pointer-events: none;
        }

        .our-team-hero-inner {
          position: relative;
          z-index: 2;
          width: min(100%, 1220px);
          margin: 0 auto;
          color: #ffffff;
        }

        .our-team-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: 48px;
          line-height: 1.15;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 18px;
        }

        .our-team-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
        }

        .our-team-breadcrumb a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
        }

        .our-team-breadcrumb span:last-child {
          color: #ffffff;
        }

        .our-team-members {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          padding: 86px 5% 104px;
        }

        .our-team-members-grid {
          max-width: 1040px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 34px;
        }

        .our-team-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          color: inherit;
          background: #ffffff;
          border: 1px solid rgba(59,89,152,.14);
          border-radius: 12px;
          padding: 42px 34px 36px;
          box-shadow: 0 20px 48px rgba(59,89,152,.1);
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .our-team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 70px rgba(59,89,152,.16);
          border-color: rgba(59,89,152,.28);
        }

        .our-team-portrait {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: #edeef8;
          border: 8px solid #ffffff;
          outline: 1px solid rgba(59,89,152,.18);
          box-shadow: 0 18px 38px rgba(0,0,0,.12);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
        }

        .our-team-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .our-team-portrait span {
          font-family: 'Marcellus', serif;
          font-size: 74px;
          color: #3B5998;
        }

        .our-team-card h2 {
          font-family: 'Marcellus', serif;
          font-size: 25px;
          line-height: 1.25;
          font-weight: 400;
          color: #111111;
          margin: 0 0 10px;
        }

        .our-team-designation,
        .our-team-qualification,
        .our-team-description {
          font-family: 'Lato', sans-serif;
          color: #333333;
          margin: 0;
        }

        .our-team-designation {
          color: #3B5998;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 8px;
        }

        .our-team-qualification {
          font-size: 13px;
          line-height: 1.55;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .our-team-description {
          font-size: 14px;
          line-height: 1.65;
          max-width: 360px;
        }

        @media (max-width: 1024px) {
          .our-team-hero {
            min-height: 390px;
            padding: 145px 5% 78px;
          }

          .our-team-hero h1 {
            font-size: 42px;
          }

          .our-team-portrait {
            width: 220px;
            height: 220px;
          }
        }

        @media (max-width: 767px) {
          .our-team-hero {
            min-height: 330px;
            padding: 120px 5% 58px;
          }

          .our-team-hero h1 {
            font-size: 36px;
          }

          .our-team-members {
            padding: 58px 5% 72px;
          }

          .our-team-members-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .our-team-card {
            padding: 32px 22px 30px;
          }

          .our-team-portrait {
            width: 190px;
            height: 190px;
          }
        }

        @media (max-width: 390px) {
          .our-team-hero h1 {
            font-size: 32px;
          }

          .our-team-breadcrumb {
            font-size: 13px;
            flex-wrap: wrap;
          }

          .our-team-portrait {
            width: 170px;
            height: 170px;
          }
        }
      `}} />
      <OurTeamHero data={data.hero || {}} />
      <TeamMembersSection data={data.teamMembers || {}} />
    </main>
  );
}
