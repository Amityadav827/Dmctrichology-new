import React from 'react';

const defaultCostFactorDescription = `However, most commonly, two factors determine the cost of a hair transplant procedure in most hair transplant clinics.

- The stage of baldness
- The number of hair grafts (or per follicles).

One can better understand the **hair transplant cost in Delhi** by consulting with the hair transplant experts at DMC Trichology Centre.

Dealing with hair loss problems and deciding to get a hair transplantation is a big decision. To begin with, who should we consult? Where to get the Transplant? All these questions need sufficient answers. So, there are certainly the most essential conditions to consider besides the cost factor. These include:

- Experience of the Clinic
- Hair Transplant Technique
- Risk Factors
- Recovery Time
- Success Rate.

Getting a hair transplant procedure at an economical rate is everybody's choice, provided the quality standard of the clinical procedure is not compromised. The reason is that hair transplant surgery is nothing less than any surgical procedure and requires optimum expertise and precautions.

Our experts at DMC Trichology are the best at determining the **_hair transplant cost in Delhi._** The experts are specialised in providing state-of-the-art hair transplant procedures at the most reasonable and affordable cost without compromising the quality standard necessary for a most natural hairline and permanent result.`;

function renderInlineFormatting(text) {
  const parts = String(text).split(/(\*\*_[\s\S]+?_\*\*|\*\*[\s\S]+?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**_') && part.endsWith('_**')) {
      return (
        <strong key={index}>
          <em>{part.slice(3, -3)}</em>
        </strong>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function parseContentDescription(description) {
  const lines = String(description || '').split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];

  const shouldRenderAsLooseList = (items) => {
    if (items.length < 2) return false;

    return items.every((item) => {
      const text = item.trim();
      return text.length > 0 && text.length <= 90 && !/[?:]$/.test(text);
    });
  };

  const flushParagraph = () => {
    if (paragraph.length) {
      if (shouldRenderAsLooseList(paragraph)) {
        blocks.push({ type: 'list', items: paragraph.map((item) => item.trim()) });
      } else {
        blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() });
      }
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'list', items: list });
      list = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const bulletMatch = line.match(/^[-*•.]\s+(.+)$/);

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    if (bulletMatch) {
      flushParagraph();
      list.push(bulletMatch[1].trim());
      return;
    }

    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
}

function CostFactorList({ items }) {
  return (
    <ul className="hair-cost-factor-list">
      {items.map((item, index) => (
        <li key={index}>
          <span className="hair-cost-factor-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 12.5l3.5 3.5L18 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{renderInlineFormatting(item)}</span>
        </li>
      ))}
    </ul>
  );
}

function ContentTickList({ items }) {
  return (
    <ul className="service-content-tick-list">
      {items.map((item, index) => (
        <li key={index}>
          <span className="service-content-tick-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 12.5l3.5 3.5L18 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{renderInlineFormatting(item)}</span>
        </li>
      ))}
    </ul>
  );
}

function ContentDescription({ description }) {
  const contentBlocks = parseContentDescription(description);

  return (
    <div className="service-content-block-description">
      {contentBlocks.map((contentBlock, index) => {
        if (contentBlock.type === 'list') {
          return <ContentTickList key={index} items={contentBlock.items} />;
        }

        return <p key={index}>{renderInlineFormatting(contentBlock.text)}</p>;
      })}
    </div>
  );
}

function HairCostFactorBlock({ heading, description }) {
  const contentBlocks = parseContentDescription(description || defaultCostFactorDescription);

  return (
    <section className="hair-cost-factor-section">
      <div className="hair-cost-factor-container">
        <div className="hair-cost-factor-card">
          <h2 className="hair-cost-factor-heading">{heading}</h2>
          {contentBlocks.map((contentBlock, index) => {
            if (contentBlock.type === 'list') {
              return <CostFactorList key={index} items={contentBlock.items} />;
            }

            return <p key={index}>{renderInlineFormatting(contentBlock.text)}</p>;
          })}
        </div>
      </div>
    </section>
  );
}

export default function ServiceContentBlock({ data, pageSlug = '' }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const activeBlocks = data
    .filter(block => block.isVisible !== false)
    .sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      return orderA - orderB;
    });

  if (activeBlocks.length === 0) {
    return null;
  }

  const isHairCostDelhiPage = ['hair-transplant-cost-in-delhi', 'hair-transplant-cost-in-india'].includes(String(pageSlug).toLowerCase());
  const costFactorBlockIndex = activeBlocks.findIndex((block) =>
    String(block.heading || '').toLowerCase().includes('what factors influence the cost of a hair transplant')
  );

  return (
    <section className="service-content-block-section">
      <div className="service-content-block-container">
        {activeBlocks.map((block, idx) => {
          if (isHairCostDelhiPage && idx === costFactorBlockIndex) {
            return <HairCostFactorBlock key={block._id || idx} heading={block.heading} description={block.description} />;
          }

          return (
            <div key={block._id || idx} className="service-content-block-item">
              {block.heading && (
                <h2 className="service-content-block-heading">
                  {block.heading}
                </h2>
              )}
              {block.description && (
                <ContentDescription description={block.description} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
