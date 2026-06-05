import Link from 'next/link';

const hasText = (value) => String(value || '').trim().length > 0;

function OurTeamHero({ data = {} }) {
  if (data.isEnabled === false) return null;
  const pageTitle = data.pageTitle || 'Our Team';
  const breadcrumbLabel = data.breadcrumbLabel || 'Our Team';

  return (
    <section className="our-team-hero">
      <div className="our-team-hero-inner">
        <h1>{pageTitle}</h1>
        <div className="our-team-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{breadcrumbLabel}</span>
        </div>
      </div>
    </section>
  );
}

function TeamMembersSection({ data = {} }) {
  if (data.isEnabled === false) return null;
  const members = Array.isArray(data.members)
    ? [...data.members]
      .filter(member => hasText(member?.name))
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    : [];

  if (members.length === 0) return null;

  return (
    <section className="our-team-members">
      <div className="our-team-members-grid">
        {members.map((member, index) => {
          const description = member.shortDescription || member.description || '';
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
                <h2>{member.name}</h2>
                {hasText(member.designation) && <p className="our-team-designation">{member.designation}</p>}
                {hasText(member.qualification) && <p className="our-team-qualification">{member.qualification}</p>}
                {hasText(description) && <p className="our-team-description">{description}</p>}
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
          width: 100%;
          margin-top: 112px;
          padding: 80px 5% 60px;
          background: #EEF0FA;
          box-sizing: border-box;
        }

        .our-team-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .our-team-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 20px;
        }

        .our-team-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: #111111;
        }

        .our-team-breadcrumb a {
          color: #111111;
          text-decoration: none;
        }

        .our-team-members {
          background: #ffffff;
          padding: 86px 5% 110px;
          box-sizing: border-box;
        }

        .our-team-members-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 40px;
          align-items: stretch;
        }

        .our-team-card {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          text-align: center;
          text-decoration: none;
          color: inherit;
          background: #EEF0FA;
          border: 1px solid rgba(59, 89, 152, 0.08);
          border-radius: 24px;
          padding: 18px 18px 34px;
          box-shadow: 0 16px 34px rgba(59, 89, 152, 0.06);
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
          box-sizing: border-box;
        }

        .our-team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 58px rgba(59, 89, 152, 0.14);
          border-color: rgba(59, 89, 152, 0.18);
        }

        .our-team-portrait {
          width: 100%;
          aspect-ratio: 1.18 / 1;
          border-radius: 22px;
          background: #3B5998;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
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
          color: #ffffff;
        }

        .our-team-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 10px;
        }

        .our-team-card h2 {
          font-family: 'Marcellus', serif;
          font-size: 18px;
          line-height: 1.28;
          font-weight: 400;
          color: #111111;
          margin: 0 0 8px;
        }

        .our-team-designation {
          font-family: 'Lato', sans-serif;
          color: #3B5998;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 700;
          margin: 0 0 14px;
        }

        .our-team-qualification {
          font-family: 'Lato', sans-serif;
          color: #111111;
          font-size: 11px;
          line-height: 1.5;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .our-team-description {
          font-family: 'Lato', sans-serif;
          color: #111111;
          font-size: 11px;
          line-height: 1.55;
          margin: 0;
          max-width: 270px;
        }

        @media (max-width: 1199px) {
          .our-team-members-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            max-width: 820px;
          }
        }

        @media (max-width: 1024px) {
          .our-team-hero {
            margin-top: 104px;
            padding: 70px 5% 52px;
          }
        }

        @media (max-width: 767px) {
          .our-team-hero {
            margin-top: 0;
            padding: 156px 16px 42px;
          }

          .our-team-hero h1 {
            font-size: clamp(30px, 8vw, 38px);
          }

          .our-team-members {
            padding: 58px 16px 76px;
          }

          .our-team-members-grid {
            grid-template-columns: 1fr;
            max-width: 380px;
            gap: 26px;
          }

          .our-team-card {
            padding: 16px 16px 30px;
            border-radius: 22px;
          }

          .our-team-portrait {
            border-radius: 20px;
          }
        }

        @media (max-width: 390px) {
          .our-team-breadcrumb {
            font-size: 13px;
            flex-wrap: wrap;
          }
        }
      `}} />
      <OurTeamHero data={data.hero || {}} />
      <TeamMembersSection data={data.teamMembers || {}} />
    </main>
  );
}
