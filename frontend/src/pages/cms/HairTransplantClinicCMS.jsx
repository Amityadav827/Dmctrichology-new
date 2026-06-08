import React from "react";
import DoctorTemplateCMS from "./DoctorTemplateCMS";

export default function HairTransplantClinicCMS() {
  return (
    <DoctorTemplateCMS
      endpoint="/hair-transplant-clinic"
      uploadEndpoint="/hair-transplant-clinic/upload-image"
      title="Hair Transplant Clinic In Delhi CMS"
      previewPath="/hair-transplant-clinic-in-delhi"
      enableTimelineDescription
    />
  );
}
