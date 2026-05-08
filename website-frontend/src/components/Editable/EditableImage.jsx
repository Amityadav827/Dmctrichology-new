"use client";
import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Image as ImageIcon } from 'lucide-react';

const EditableImage = ({ sectionId, fieldPath, src, alt, className = "", imgClassName = "", ...props }) => {
  const { isEditMode, updateField } = useBuilder();

  const handleEdit = (e) => {
    if (!isEditMode) return;
    e.stopPropagation();
    
    const newUrl = window.prompt("Enter Image URL:", src);
    if (newUrl !== null && newUrl !== src) {
      updateField(sectionId, fieldPath, newUrl);
    }
  };

  return (
    <div className={`relative group/img ${className}`} onClick={handleEdit}>
      <img src={src} alt={alt} className={imgClassName} {...props} />
      {isEditMode && (
        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-2 border-blue-600 border-dashed rounded-lg">
          <div className="bg-white p-2 rounded-full shadow-lg text-blue-600">
            <ImageIcon size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
