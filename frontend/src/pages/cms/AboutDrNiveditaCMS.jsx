import React from "react";
import DoctorTemplateCMS from "./DoctorTemplateCMS";

export default function AboutDrNiveditaCMS() {
  return (
    <DoctorTemplateCMS
      endpoint="/about-dr-nivedita"
      uploadEndpoint="/about-dr-nivedita/upload-image"
      title="About Dr. Nivedita Dadu CMS"
      previewPath="/about-dr-nivedita-dadu"
    />
  );
}
