import React from "react";
import DoctorTemplateCMS from "./DoctorTemplateCMS";

export default function AboutDmcTrichologyCMS() {
  return (
    <DoctorTemplateCMS
      endpoint="/about-dmc-trichology"
      uploadEndpoint="/about-dmc-trichology/upload-image"
      title="About DMC Trichology CMS"
      previewPath="/about-dadu-medical-centre"
    />
  );
}
