"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const hasText = (value) => String(value || '').trim().length > 0;
const blueIconFilter = 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)';
const headingIcon = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962112281-lsmvsocjusyrery1hjum.png';
const arrowIcon = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/cloudinary-recovery/xc065ftxo6zamcldpd59.png';

const getMemberKey = (member = {}, index = 0) =>
  `${member.name || 'member'}-${member.sortOrder ?? index}-${index}`;

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
  const members = useMemo(
    () =>
      Array.isArray(data.members)
        ? [...data.members]
            .filter((member) => hasText(member?.name) && member?.isVisible !== false)
            .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
        : [],
    [data.members]
  );
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    if (members.length === 0) {
      if (activeKey) setActiveKey('');
      return;
    }

    const activeExists = members.some((member, index) => getMemberKey(member, index) === activeKey);
    if (!activeExists) {
      setActiveKey(getMemberKey(members[0], 0));
    }
  }, [activeKey, members]);

  if (data.isEnabled === false || members.length === 0) return null;

  const badgeText = hasText(data.badgeText) ? data.badgeText : 'OUR MEDICAL EXPERTS';
  const heading = hasText(data.heading) ? data.heading : 'Meet Our Expert Doctors';
  const activeMember =
    members.find((member, index) => getMemberKey(member, index) === activeKey) || members[0];
  const detailText = activeMember?.description || activeMember?.shortDescription || '';

  return (
    <section className="our-team-members">
      <div className="our-team-members-inner">
        <div className="our-team-members-header">
          <div className="our-team-members-badge">
            <img src={headingIcon} alt="" aria-hidden="true" />
            <span>{badgeText}</span>
          </div>
          <h2>{heading}</h2>
        </div>

        <div className="our-team-doctors-shell">
          <div className="our-team-selector-list" role="tablist" aria-label="DMC doctors">
            {members.map((member, index) => {
              const memberKey = getMemberKey(member, index);
              const isActive = member === activeMember;

              return (
                <button
                  key={memberKey}
                  type="button"
                  className={`our-team-selector-card${isActive ? ' active' : ''}`}
                  onClick={() => setActiveKey(memberKey)}
                  aria-pressed={isActive}
                >
                  <div className="our-team-selector-copy">
                    <span className="our-team-selector-name">{member.name}</span>
                  </div>
                  <span className="our-team-selector-arrow" aria-hidden="true">
                    <img src={arrowIcon} alt="" />
                  </span>
                </button>
              );
            })}
          </div>

          <article className="our-team-detail-card">
            <div className="our-team-detail-image-wrap">
              {hasText(activeMember?.image) ? (
                <img
                  src={activeMember.image}
                  alt={activeMember.name || 'DMC doctor'}
                  className="our-team-detail-image"
                />
              ) : (
                <div className="our-team-detail-fallback">
                  {String(activeMember?.name || 'DMC').slice(0, 1)}
                </div>
              )}
            </div>

            <div className="our-team-detail-copy">
              <div className="our-team-detail-badge" aria-hidden="true">
                <img src="/icons/surgeons/surgeon-badge.svg" alt="" />
              </div>
              <h3>{activeMember?.name}</h3>
              {hasText(activeMember?.designation) && (
                <p className="our-team-detail-designation">{activeMember.designation}</p>
              )}
              {hasText(activeMember?.qualification) && (
                <p className="our-team-detail-qualification">{activeMember.qualification}</p>
              )}
              {hasText(detailText) && (
                <p className="our-team-detail-description">{detailText}</p>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function OurTeamPage({ data = {} }) {
  return (
    <main className="our-team-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .our-team-page {
          background: #ffffff;
          color: #111111;
          overflow-x: hidden;
        }

        .our-team-hero {
          width: 100%;
          margin-top: 0;
          padding: 80px 5% 60px;
          background: #EEF0FA;
          box-sizing: border-box;
        }

        .our-team-hero-inner {
          max-width: 1200px;
          margin: 110px auto 0;
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
          padding: 100px clamp(24px, 4vw, 72px) 110px;
          box-sizing: border-box;
        }

        .our-team-members-inner {
          max-width: 1480px;
          margin: 0 auto;
        }

        .our-team-members-header {
          margin-bottom: 60px;
        }

        .our-team-members-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .our-team-members-badge img {
          width: 40px;
          height: auto;
          filter: ${blueIconFilter};
        }

        .our-team-members-badge span {
          color: #3B5998;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .our-team-members-header h2 {
          margin: 0;
          color: #111111;
          font-family: 'Marcellus', serif;
          font-size: clamp(38px, 4vw, 58px);
          line-height: 1.08;
          font-weight: 400;
          max-width: 820px;
        }

        .our-team-doctors-shell {
          display: grid;
          grid-template-columns: minmax(280px, 380px) minmax(0, 1fr);
          gap: 48px;
          align-items: flex-start;
        }

        .our-team-selector-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
        }

        .our-team-selector-card {
          width: 100%;
          padding: 25px 30px;
          border: 0;
          border-radius: 25px;
          background: #A8B7CA;
          color: #000000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          text-align: left;
          transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: none;
        }

        .our-team-selector-card:hover,
        .our-team-selector-card.active {
          background: #3B5998;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 18px 36px rgba(59, 89, 152, 0.18);
        }

        .our-team-selector-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .our-team-selector-name {
          font-family: 'Marcellus', serif;
          font-size: 18px;
          line-height: 1.35;
        }

        .our-team-selector-arrow {
          flex: 0 0 auto;
          transform: none;
          transition: transform 0.3s ease;
        }

        .our-team-selector-arrow img {
          width: 40px;
          height: auto;
          display: block;
        }

        .our-team-selector-card:hover .our-team-selector-arrow,
        .our-team-selector-card.active .our-team-selector-arrow {
          transform: rotate(-45deg);
        }

        .our-team-detail-card {
          background: #3B5998;
          border-radius: 40px;
          padding: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
          min-width: 0;
        }

        .our-team-detail-image-wrap {
          flex: 1 1 300px;
          min-width: 280px;
          min-height: 420px;
          border-radius: 25px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.18);
        }

        .our-team-detail-image,
        .our-team-detail-fallback {
          width: 100%;
          height: 100%;
          min-height: 420px;
          display: block;
        }

        .our-team-detail-image {
          object-fit: cover;
        }

        .our-team-detail-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Marcellus', serif;
          font-size: 86px;
          color: #ffffff;
        }

        .our-team-detail-copy {
          flex: 1 1 300px;
          padding: 10px 0;
          min-width: 0;
        }

        .our-team-detail-badge {
          margin-bottom: 20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .our-team-detail-badge img {
          width: 26px;
          height: 26px;
          object-fit: contain;
        }

        .our-team-detail-copy h3 {
          margin: 0 0 15px;
          color: #ffffff;
          font-family: 'Marcellus', serif;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 400;
        }

        .our-team-detail-designation,
        .our-team-detail-qualification,
        .our-team-detail-description {
          margin: 0;
          color: #ffffff;
        }

        .our-team-detail-designation {
          font-family: 'Marcellus', serif;
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .our-team-detail-qualification {
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          line-height: 1.5;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
          opacity: 0.88;
        }

        .our-team-detail-description {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-line;
          max-width: 520px;
        }

        @media (max-width: 1199px) {
          .our-team-members {
            padding: 84px clamp(20px, 3.5vw, 40px) 96px;
          }

          .our-team-doctors-shell {
            grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
            gap: 32px;
          }

          .our-team-members-header h2 {
            max-width: 680px;
          }
        }

        @media (max-width: 1024px) {
          .our-team-hero {
            margin-top: 104px;
            padding: 70px 5% 52px;
          }

          .our-team-doctors-shell {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        @media (max-width: 767px) {
          .our-team-hero {
            margin-top: 0;
            padding: 56px 16px 42px;
          }

          .our-team-hero h1 {
            font-size: clamp(30px, 8vw, 38px);
          }

          .our-team-members {
            padding: 48px 16px 64px;
          }

          .our-team-members-header {
            margin-bottom: 32px;
          }

          .our-team-members-badge span {
            font-size: 12px;
          }

          .our-team-members-header h2 {
            font-size: 26px;
            max-width: 100%;
          }

          .our-team-selector-card {
            padding: 18px 20px;
            border-radius: 20px;
          }

          .our-team-selector-name {
            font-size: 16px;
          }

          .our-team-detail-card {
            padding: 18px;
            border-radius: 24px;
            gap: 20px;
          }

          .our-team-detail-image-wrap,
          .our-team-detail-image,
          .our-team-detail-fallback {
            min-width: 0;
            min-height: 280px;
          }

          .our-team-detail-copy h3 {
            font-size: 24px;
          }
        }

        @media (max-width: 390px) {
          .our-team-breadcrumb {
            font-size: 13px;
            flex-wrap: wrap;
          }
        }
      `
        }}
      />
      <OurTeamHero data={data.hero || {}} />
      <TeamMembersSection data={data.teamMembers || {}} />
    </main>
  );
}
