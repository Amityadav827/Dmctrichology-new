"use client";

import { useEffect } from 'react';

const hashString = (value) => {
  let hash = 0;
  const input = String(value || '');
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const appendHtml = (html, targetName) => {
  if (!html || typeof document === 'undefined') return;

  const target = targetName === 'head' ? document.head : document.body;
  const template = document.createElement('template');
  template.innerHTML = html;

  Array.from(template.content.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;

    const cloned = node.nodeName.toLowerCase() === 'script'
      ? document.createElement('script')
      : node.cloneNode(true);

    if (node.nodeName.toLowerCase() === 'script') {
      Array.from(node.attributes || []).forEach((attr) => {
        cloned.setAttribute(attr.name, attr.value);
      });
      cloned.textContent = node.textContent;
    }

    const signature = hashString(`${targetName}:${cloned.outerHTML || cloned.textContent}`);
    if (document.querySelector(`[data-dmc-custom-script="${signature}"]`)) return;

    if (cloned.setAttribute) {
      cloned.setAttribute('data-dmc-custom-script', signature);
    }
    target.appendChild(cloned);
  });
};

export default function CustomScriptsInjector({ headScripts = '', bodyStartScripts = '' }) {
  useEffect(() => {
    appendHtml(headScripts, 'head');
    appendHtml(bodyStartScripts, 'body');
  }, [headScripts, bodyStartScripts]);

  return null;
}
