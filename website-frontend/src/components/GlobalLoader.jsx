"use client";
import React from 'react';

export default function GlobalLoader() {
  return (
    <div className="global-loader">
      <div className="loader-container">
        <div className="loader-spinner" />
        <div className="loader-logo-placeholder">DMC</div>
      </div>
    </div>
  );
}
