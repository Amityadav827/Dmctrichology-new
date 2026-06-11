"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';


import { useBuilder } from '../context/BuilderContext';

const DEFAULT_MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.444704381882!2d77.16010531508083!3d28.55641798244799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1df64319087d%3A0xe6759c22f07f2324!2sDMC%20Trichology%20Vasant%20Vihar!5e0!3m2!1sen!2sin!4v1625471234567!5m2!1sen!2sin";

const normalizeMapItem = (map = {}, index = 0) => ({
  id: map.id || `map-${index + 1}`,
  branchName: map.branchName || map.name || map.area || `Map ${index + 1}`,
  city: map.city || '',
  area: map.area || '',
  googleMapEmbedUrl: map.googleMapEmbedUrl || map.embedUrl || '',
  displayOrder: Number.isFinite(Number(map.displayOrder)) ? Number(map.displayOrder) : (index + 1) * 10,
  isEnabled: map.isEnabled !== false
});

const isEmbeddableMapUrl = (url = '') => {
  const value = String(url || '').trim();
  return value.includes('/maps/embed') || value.includes('output=embed');
};

const getMapEmbedUrl = (map = {}) => {
  const rawUrl = String(map.googleMapEmbedUrl || '').trim();
  if (isEmbeddableMapUrl(rawUrl)) return rawUrl;

  const query = [
    map.branchName,
    map.city,
    map.area,
    rawUrl
  ].filter(Boolean).join(', ');

  return `https://www.google.com/maps?q=${encodeURIComponent(query || 'DMC Trichology')}&output=embed`;
};

const getEnabledMaps = (mapData = {}) => {
  const legacyMap = normalizeMapItem({
    id: 'legacy-map-1',
    branchName: mapData.branchName || mapData.area || mapData.city || 'Clinic Location',
    city: mapData.city || '',
    area: mapData.area || '',
    googleMapEmbedUrl: mapData.googleMapEmbedUrl || DEFAULT_MAP_EMBED_URL,
    displayOrder: 10,
    isEnabled: true
  }, 0);

  const sourceMaps = Array.isArray(mapData.maps) && mapData.maps.length > 0
    ? mapData.maps.map(normalizeMapItem)
    : [legacyMap];

  const enabledMaps = sourceMaps
    .filter(map => map.isEnabled !== false && map.googleMapEmbedUrl)
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

  const maps = enabledMaps.length > 0 ? enabledMaps : [legacyMap];
  return mapData.multipleMapsEnabled === true ? maps : maps.slice(0, 1);
};

const MapSection = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  // Real-time sync from Visual Builder
  React.useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'contact-map') {
      setData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const { mapHeight = "600px" } = data || {};
  const enabledMaps = getEnabledMaps(data || {});
  const isMultiMap = enabledMaps.length > 1;

  return (
    <EditableSection sectionId="contact-map" label="Location Map Section">
      <section
        className={`map-section${isMultiMap ? ' map-section--grid' : ''}`}
        style={{ '--map-height': mapHeight }}
      >
        <div className="map-grid">
          {enabledMaps.map((mapItem, index) => (
            <div className="map-frame" key={mapItem.id || `${mapItem.googleMapEmbedUrl}-${index}`}>
              <iframe
                src={getMapEmbedUrl(mapItem) || DEFAULT_MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title={mapItem.branchName || mapItem.area || mapItem.city || `Clinic Location ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <style jsx>{`
          .map-section {
            position: relative;
            width: 100%;
            height: var(--map-height);
            background-color: #f0f0f0;
          }

          .map-grid {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
          }

          .map-frame {
            width: 100%;
            height: 100%;
            background-color: #f0f0f0;
            overflow: hidden;
          }

          .map-section--grid {
            height: auto;
            background-color: #fff;
            padding: 0 5% 100px 5%;
          }

          .map-section--grid .map-grid {
            height: auto;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }

          .map-section--grid .map-frame {
            height: var(--map-height);
            min-height: 320px;
          }

          @media (max-width: 767px) {
            .map-section--grid .map-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default MapSection;
