"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const BuilderContext = createContext();

export const BuilderProvider = ({ children, initialTopBar, initialHero }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteConfig, setSiteConfig] = useState({});
  const [topBarCMS, setTopBarCMS] = useState(initialTopBar || null);
  const [heroCMS, setHeroCMS] = useState(initialHero || null);
  const [activeElement, setActiveElement] = useState(null);

  useEffect(() => {
    // Check if we are in edit mode via URL parameter or postMessage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("edit") === "true") {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setIsEditMode(true);
    }

    // Listen for messages from the Dashboard (Admin Panel)
    const handleMessage = (event) => {
      // Security: Check origin if possible
      if (event.data.type === "TOGGLE_EDIT_MODE") {
        setIsEditMode(event.data.payload);
      }
      if (event.data.type === "UPDATE_CONFIG") {
        setSiteConfig(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const updateField = (sectionId, fieldPath, value) => {
    // Notify local listeners (like AboutUsClient) for instant preview
    window.dispatchEvent(new CustomEvent('cms-update', { 
      detail: { sectionId, fieldPath, value } 
    }));
    
    // Notify Dashboard (Parent) of the change for persistence
    window.parent.postMessage({
      type: "FIELD_UPDATED",
      payload: { sectionId, fieldPath, value }
    }, "*");
  };

  return (
    <BuilderContext.Provider value={{ 
      isEditMode, 
      setIsEditMode,
      siteConfig, 
      setSiteConfig,
      topBarCMS,
      setTopBarCMS,
      heroCMS,
      setHeroCMS,
      activeElement, 
      setActiveElement, 
      updateField 
    }}>
      <div className={isEditMode ? "builder-active" : ""}>
        {children}
      </div>
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
