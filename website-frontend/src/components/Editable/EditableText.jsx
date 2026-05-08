"use client";
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';

const EditableText = React.forwardRef(({ sectionId, fieldPath, children, tag: Tag = "span", className = "", ...props }, ref) => {
  const { isEditMode, updateField } = useBuilder();

  const handleBlur = (e) => {
    if (!isEditMode) return;
    const newValue = e.target.innerText;
    updateField(sectionId, fieldPath, newValue);
  };

  return (
    <Tag
      ref={ref}
      className={`editable-text ${className} ${isEditMode ? 'builder-text-editable' : ''}`}
      contentEditable={isEditMode}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onClick={(e) => isEditMode && e.stopPropagation()}
      {...props}
    >
      {children}
    </Tag>
  );
});

EditableText.displayName = 'EditableText';

export default EditableText;
