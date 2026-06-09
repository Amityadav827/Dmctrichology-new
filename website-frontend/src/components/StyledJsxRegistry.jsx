'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

// Collects styled-jsx styles during SSR and injects them into the document
// head via useServerInsertedHTML, so component-level <style jsx> CSS ships in
// the initial HTML instead of being applied only after hydration (fixes FOUC).
export default function StyledJsxRegistry({ children }) {
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
