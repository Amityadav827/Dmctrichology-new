"use client";
import React, { useMemo, useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';
import RichTextContent from './RichTextContent';

const defaultExperience = [
  {
    role: "Senior Resident Anaesthesia & Critical Care",
    hospital: "Dr. Ram Manohar Lohia Hospital, New Delhi",
    duration: "2014 - 2017"
  },
  {
    role: "Fellowship In Pain Medicine",
    hospital: "King Edward Memorial Hospital, Mumbai",
    duration: "2017 - 2018"
  },
  {
    role: "Attending Consultant Anaesthesia & Critical Care",
    hospital: "Primus Hospital, New Delhi",
    duration: "2018"
  },
  {
    role: "Consultant Pain Medicine & Palliative Care",
    hospital: "Artemis Hospital, Gurgaon",
    duration: "2018 - 2020"
  },
  {
    role: "Senior Consultant Hair Transplant Surgeon",
    hospital: "Dadu Medical Centre, New Delhi",
    duration: "2020 - Present"
  }
];

const defaultEducation = [
  {
    degree: "MBBS",
    institution: "Himalayan Institute of Medical Sciences (HIMS), Dehradun",
    year: "2005"
  },
  {
    degree: "Diploma In Anaesthesia & Critical Care",
    institution: "Himalayan Institute of Medical Sciences (HIMS), Dehradun",
    year: "2012"
  }
];

export default function AboutDrNandaniEducationExperience({ data = {}, credentialsData = {}, showCredentialsTab = true, showSecondImage = true, singleImageTall = false }) {
  const [activeTab, setActiveTab] = useState('experience');

  const tabs = useMemo(() => {
    const credentialItems = (credentialsData.credentialsList || []).map(item => ({
      title: item.text,
      subtitle: "",
      date: ""
    }));

    const builtTabs = [
      {
        id: 'experience',
        label: data.experienceTabLabel || data.experienceTitle || "Experience",
        items: (data.experienceItems && data.experienceItems.length > 0 ? data.experienceItems : defaultExperience).map(item => ({
          title: item.role,
          subtitle: item.hospital,
          date: item.duration,
          pathRoot: 'educationExperience.experienceItems',
          titleKey: 'role',
          subtitleKey: 'hospital',
          dateKey: 'duration'
        }))
      },
      {
        id: 'education',
        label: data.educationTabLabel || data.educationTitle || "Education",
        items: (data.educationItems && data.educationItems.length > 0 ? data.educationItems : defaultEducation).map(item => ({
          title: item.degree,
          subtitle: item.institution,
          date: item.year,
          pathRoot: 'educationExperience.educationItems',
          titleKey: 'degree',
          subtitleKey: 'institution',
          dateKey: 'year'
        }))
      },
      {
        id: 'credentials',
        label: data.credentialsTabLabel || credentialsData.heading || "Credentials",
        items: credentialItems.length > 0 ? credentialItems.map(item => ({
          ...item,
          pathRoot: 'credentialsSection.credentialsList',
          titleKey: 'text',
          subtitleKey: '',
          dateKey: ''
        })) : [
          { title: "Fellowship In Aesthetic Medicine", subtitle: "", date: "", pathRoot: 'credentialsSection.credentialsList', titleKey: 'text' },
          { title: "Fellowship In Hair Science", subtitle: "", date: "", pathRoot: 'credentialsSection.credentialsList', titleKey: 'text' },
          { title: "Fellowship In Pain Medicine", subtitle: "", date: "", pathRoot: 'credentialsSection.credentialsList', titleKey: 'text' }
        ]
      }
    ];

    return showCredentialsTab ? builtTabs : builtTabs.filter(tab => tab.id !== 'credentials');
  }, [data, credentialsData, showCredentialsTab]);

  const active = tabs.find(tab => tab.id === activeTab) || tabs[0];
  const topImage = data.topImage || "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";
  const bottomImage = data.bottomImage || "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";
  const hasEditorialContent = credentialsData.leftHeading || credentialsData.leftText || credentialsData.rightHeading || credentialsData.rightText;

  return (
    <EditableSection sectionId="about-nandani-education" label="Experience Education Credentials">
      <section className="nandani-credentials-tabs-section">
        <div className="nandani-credentials-tabs-inner">
          <div className="nandani-tabs-content">
            <div className="nandani-tabs-switcher" role="tablist" aria-label="Doctor credentials tabs" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={activeTab === tab.id ? 'is-active' : ''}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="nandani-timeline-list">
              {active.items.map((item, idx) => {
                const titlePath = `${item.pathRoot}.${idx}.${item.titleKey}`;
                const subtitlePath = item.subtitleKey ? `${item.pathRoot}.${idx}.${item.subtitleKey}` : "";
                const datePath = item.dateKey ? `${item.pathRoot}.${idx}.${item.dateKey}` : "";

                return (
                  <article key={`${active.id}-${idx}`} className="nandani-timeline-entry">
                    <div className="nandani-timeline-check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h3>
                        <EditableText sectionId={active.id === 'credentials' ? 'about-nandani-credentials' : 'about-nandani-education'} fieldPath={titlePath} tag="span">
                          {item.title}
                        </EditableText>
                      </h3>
                      {(item.subtitle || item.date) && (
                        <p>
                          {item.subtitle && (
                            <EditableText sectionId="about-nandani-education" fieldPath={subtitlePath} tag="span">
                              {item.subtitle}
                            </EditableText>
                          )}
                          {item.date && (
                            <>
                              {" "}
                              <EditableText sectionId="about-nandani-education" fieldPath={datePath} tag="span">
                                ({item.date})
                              </EditableText>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={`nandani-tabs-images${showSecondImage ? '' : ' nandani-tabs-images-single'}${singleImageTall ? ' nandani-tabs-images-single-tall' : ''}`} aria-label="Doctor credentials images">
            <div className="nandani-tabs-image-card">
              <EditableImage
                sectionId="about-nandani-education"
                fieldPath="educationExperience.topImage"
                src={topImage}
                alt="Dr. Nandani Dadu credentials top"
                className="nandani-tabs-editable-image"
              />
            </div>
            {showSecondImage && (
              <div className="nandani-tabs-image-card">
                <EditableImage
                  sectionId="about-nandani-education"
                  fieldPath="educationExperience.bottomImage"
                  src={bottomImage}
                  alt="Dr. Nandani Dadu credentials bottom"
                  className="nandani-tabs-editable-image"
                />
              </div>
            )}
          </div>
        </div>

        {hasEditorialContent && (
          <div className="nandani-credentials-editorial">
            <article>
              {credentialsData.leftHeading && (
                <h3>
                  <EditableText sectionId="about-nandani-credentials" fieldPath="credentialsSection.leftHeading" tag="span">
                    {credentialsData.leftHeading}
                  </EditableText>
                </h3>
              )}
              <RichTextContent value={credentialsData.leftText} className="nandani-credentials-rich" />
            </article>

            <article>
              {credentialsData.rightHeading && (
                <h3>
                  <EditableText sectionId="about-nandani-credentials" fieldPath="credentialsSection.rightHeading" tag="span">
                    {credentialsData.rightHeading}
                  </EditableText>
                </h3>
              )}
              <RichTextContent value={credentialsData.rightText} className="nandani-credentials-rich" />
            </article>
          </div>
        )}
      </section>

      <style jsx>{`
        .nandani-credentials-tabs-section {
          width: 100%;
          background: #ffffff;
          padding: 96px 5%;
        }

        .nandani-credentials-tabs-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.72fr);
          gap: 58px;
          align-items: start;
        }

        .nandani-tabs-switcher {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(17, 17, 17, 0.18);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 34px;
          background: #ffffff;
        }

        .nandani-tabs-switcher button {
          min-height: 48px;
          border: 0;
          background: transparent;
          color: #111111;
          font-family: 'Marcellus', serif;
          font-size: 22px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .nandani-tabs-switcher button.is-active {
          background: #3b5998;
          color: #ffffff;
          border-radius: 999px;
        }

        .nandani-timeline-list {
          display: grid;
          gap: 0;
        }

        .nandani-timeline-entry {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 20px;
          padding: 26px 0;
          border-bottom: 1px solid rgba(17, 17, 17, 0.16);
        }

        .nandani-timeline-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b5998;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }

        .nandani-timeline-entry h3 {
          font-family: 'Marcellus', serif;
          font-size: 21px;
          line-height: 1.35;
          font-weight: 400;
          color: #111111;
          margin: 0 0 8px;
        }

        .nandani-timeline-entry p {
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #333333;
          margin: 0;
        }

        .nandani-tabs-images {
          display: grid;
          gap: 28px;
          padding-top: 54px;
        }

        .nandani-tabs-image-card {
          border-radius: 28px;
          overflow: hidden;
          background: #d7d7d7;
          height: 240px;
          box-shadow: 0 22px 42px rgba(17, 17, 17, 0.08);
        }

        .nandani-tabs-image-card :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .nandani-tabs-image-card :global(.nandani-tabs-editable-image) {
          width: 100%;
          height: 100%;
        }

        @media (min-width: 981px) {
          .nandani-tabs-images-single {
            padding-top: 54px;
          }
          .nandani-tabs-images-single .nandani-tabs-image-card {
            height: 240px;
          }
          .nandani-tabs-images-single-tall .nandani-tabs-image-card {
            height: 508px;
          }
        }

        .nandani-credentials-editorial {
          max-width: 1300px;
          margin: 64px auto 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0;
          background: #26345c;
          border-radius: 28px;
          padding: 64px 70px;
          box-shadow: 0 30px 60px rgba(38, 52, 92, 0.22);
        }

        .nandani-credentials-editorial article {
          padding: 0 50px;
        }

        .nandani-credentials-editorial article:first-child {
          padding-left: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.16);
        }

        .nandani-credentials-editorial article:last-child {
          padding-right: 0;
        }

        .nandani-credentials-editorial article h3 {
          font-family: 'Marcellus', serif;
          font-size: clamp(25px, 2.4vw, 34px);
          line-height: 1.18;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 24px;
          padding-bottom: 16px;
          position: relative;
        }

        .nandani-credentials-editorial article h3::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 54px;
          height: 3px;
          border-radius: 2px;
          background: #d4af7a;
        }

        :global(.nandani-credentials-rich),
        :global(.nandani-credentials-rich p),
        :global(.nandani-credentials-rich li) {
          font-family: 'Lato', sans-serif;
          font-size: 15.5px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.82);
        }

        :global(.nandani-credentials-rich p) {
          margin: 0 0 22px;
        }

        :global(.nandani-credentials-rich p:last-child) {
          margin-bottom: 0;
        }

        :global(.nandani-credentials-rich strong) {
          font-weight: 800;
          color: #ffffff;
        }

        :global(.nandani-credentials-rich ul),
        :global(.nandani-credentials-rich ol) {
          margin: 0 0 22px 22px;
          padding: 0;
        }

        @media (max-width: 980px) {
          .nandani-credentials-tabs-inner {
            grid-template-columns: 1fr;
            gap: 38px;
          }

          .nandani-tabs-images {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding-top: 0;
          }

          .nandani-credentials-editorial {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 40px 30px;
            border-radius: 24px;
          }
          .nandani-credentials-editorial article {
            padding: 0;
          }
          .nandani-credentials-editorial article:first-child {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.16);
            padding-bottom: 34px;
            margin-bottom: 34px;
          }
        }

        @media (max-width: 620px) {
          .nandani-credentials-tabs-section {
            padding: 66px 5%;
          }

          .nandani-tabs-switcher {
            border-radius: 22px;
            grid-template-columns: 1fr;
          }

          .nandani-tabs-switcher button {
            font-size: 19px;
          }

          .nandani-tabs-switcher button.is-active {
            border-radius: 18px;
          }

          .nandani-tabs-images {
            grid-template-columns: 1fr;
          }

          .nandani-timeline-entry {
            gap: 14px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
