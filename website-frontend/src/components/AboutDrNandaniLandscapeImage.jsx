"use client";

import React from "react";
import EditableSection from "./Editable/EditableSection";
import EditableImage from "./Editable/EditableImage";
import EditableText from "./Editable/EditableText";

const legacyFallbackImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";
const fallbackImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780906825092-79561886.webp";

export default function AboutDrNandaniLandscapeImage({ data = {}, fallbackSrc = "" }) {
  const sourceImage = data.image || fallbackSrc || fallbackImage;
  const image = sourceImage === legacyFallbackImage ? fallbackImage : sourceImage;
  const imageAlt = data.imageAlt || "Dr. Nandani Dadu hair restoration care";
  const eyebrow = data.eyebrow || "TRUSTED CARE SERVICES";
  const heading = data.heading || "What Makes Dr. Nandani Dadu The Best Hair Transplant Surgeon In Delhi?";
  const backgroundColor = data.sectionBgColor || "#ffffff";
  const paddingTop = data.paddingTop || "56px";
  const paddingBottom = data.paddingBottom || "56px";
  const contentMaxWidth = data.contentMaxWidth || "1220px";
  const maxHeight = data.maxHeight || "340px";

  return (
    <EditableSection sectionId="about-nandani-timeline" label="Dr Nandani Landscape Image">
      <section
        className="nandani-landscape-image-section"
        style={{ backgroundColor, paddingTop, paddingBottom }}
      >
        <div className="nandani-landscape-image-inner" style={{ maxWidth: contentMaxWidth }}>
          <div className="nandani-landscape-eyebrow">
            <span />
            <EditableText sectionId="about-nandani-timeline" fieldPath="timeline.eyebrow" tag="small">
              {eyebrow}
            </EditableText>
          </div>

          <h2 className="nandani-landscape-title">
            <EditableText sectionId="about-nandani-timeline" fieldPath="timeline.heading" tag="span">
              {heading}
            </EditableText>
          </h2>

          <EditableImage
            sectionId="about-nandani-timeline"
            fieldPath="timeline.image"
            src={image}
            alt={imageAlt}
            className="nandani-landscape-image-frame"
            imgClassName="nandani-landscape-image"
          />
        </div>
      </section>

      <style jsx>{`
        .nandani-landscape-image-section {
          width: 100%;
          padding-left: 5%;
          padding-right: 5%;
        }

        .nandani-landscape-image-inner {
          margin: 0 auto;
        }

        .nandani-landscape-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
        }

        .nandani-landscape-eyebrow span {
          width: 58px;
          height: 1px;
          background: #3b5998;
          position: relative;
        }

        .nandani-landscape-eyebrow span::after {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #3b5998;
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
        }

        .nandani-landscape-eyebrow small {
          font-family: 'Lato', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #333333;
          text-transform: uppercase;
        }

        .nandani-landscape-title {
          font-family: 'Marcellus', serif;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 34px;
          max-width: 1120px;
        }

        :global(.nandani-landscape-image-frame) {
          width: 100%;
          border-radius: 0;
          overflow: visible;
          border: 0px solid rgba(17, 17, 17, 0.08);
          background: #f3f4f6;
        }

        :global(.nandani-landscape-image) {
          width: 100%;
          height: auto;
          max-height: unset;
          display: block;
        }

        @media (max-width: 640px) {
          .nandani-landscape-image-section {
            padding-top: 42px !important;
            padding-bottom: 42px !important;
          }

          :global(.nandani-landscape-image) {
            height: auto;
            max-height: unset;
          }

          .nandani-landscape-title {
            font-size: 31px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
