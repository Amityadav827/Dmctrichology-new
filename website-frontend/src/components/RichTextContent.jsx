"use client";

import React from 'react';

export function escapeRichText(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function richTextHtml(value = '') {
  const text = String(value || '').trim();
  if (!text) return '';

  if (/<\/?[a-z][\s\S]*>/i.test(text)) {
    return text;
  }

  return text
    .split(/\n{2,}/)
    .map(paragraph => {
      const escaped = escapeRichText(paragraph)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
      return `<p>${escaped}</p>`;
    })
    .join('');
}

export default function RichTextContent({ value = '', as: Tag = 'div', className = '' }) {
  const html = richTextHtml(value);
  if (!html) return null;

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
