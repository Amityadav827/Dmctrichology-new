"use client";

import React from "react";
import EditableSection from "./Editable/EditableSection";
import EditableImage from "./Editable/EditableImage";

const fallbackImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";

export default function AboutDrNandaniLandscapeImage({ data = {}, fallbackSrc = "" }) {
  const image = data.image || fallbackSrc || fallbackImage;
  const imageAlt = data.imageAlt || "Dr. Nandani Dadu hair restoration care";
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
          <EditableImage
            sectionId="about-nandani-timeline"
            fieldPath="timeline.image"
            src={image}
            alt={imageAlt}
            className="nandani-landscape-image-frame"
            imgClassName="nandani-landscape-image"
            style={{ maxHeight }}
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

        :global(.nandani-landscape-image-frame) {
          width: 100%;
          border-radius: 0;
          overflow: hidden;
          border: 1px solid rgba(17, 17, 17, 0.08);
          background: #f3f4f6;
        }

        :global(.nandani-landscape-image) {
          width: 100%;
          height: clamp(190px, 28vw, 340px);
          object-fit: cover;
          display: block;
        }

        @media (max-width: 640px) {
          .nandani-landscape-image-section {
            padding-top: 42px !important;
            padding-bottom: 42px !important;
          }

          :global(.nandani-landscape-image) {
            height: 190px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
