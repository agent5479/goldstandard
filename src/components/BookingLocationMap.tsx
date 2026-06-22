import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  getLocationMapsUrl,
  type BookingLocation,
} from '../data/bookingLocations';

type BookingLocationMapProps = {
  locations: BookingLocation[];
  mapCenter: [number, number];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  emptyMessage?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function FitBounds({ locations, mapCenter }: { locations: BookingLocation[]; mapCenter: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((location) => [location.lat, location.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
      return;
    }
    map.setView(mapCenter, 10);
  }, [map, locations, mapCenter]);

  return null;
}

function locationIcon(location: BookingLocation, selected: boolean) {
  const safeName = escapeHtml(location.name);
  return L.divIcon({
    className: 'booking-map-marker-wrap',
    html:
      `<div class="booking-map-marker${selected ? ' is-selected' : ''}">` +
      `<span class="booking-map-pin${selected ? ' is-selected' : ''}" aria-hidden="true"></span>` +
      `<span class="booking-map-pin-label">${safeName}</span>` +
      '</div>',
    iconSize: [120, 44],
    iconAnchor: [60, 12],
  });
}

/** Interactive map for choosing a training location within a region. */
export default function BookingLocationMap({
  locations,
  mapCenter,
  selectedId,
  onSelect,
  disabled = false,
  emptyMessage,
}: BookingLocationMapProps) {
  return (
    <div className="booking-location-picker">
      {emptyMessage ? <p className="form-hint">{emptyMessage}</p> : null}
      <div className="booking-location-map" aria-hidden={disabled}>
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          doubleClickZoom={!disabled}
          className="booking-location-map-inner"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds locations={locations} mapCenter={mapCenter} />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={locationIcon(location, selectedId === location.id)}
              eventHandlers={{
                click: () => {
                  if (!disabled) onSelect(location.id);
                },
              }}
            >
              <Popup>
                <strong>{location.name}</strong>
                <br />
                <a href={getLocationMapsUrl(location)} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {locations.length > 0 ? (
        <div className="booking-location-list" role="radiogroup" aria-label="Training location">
          {locations.map((location) => (
            <LocationOption
              key={location.id}
              location={location}
              selected={selectedId === location.id}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function LocationOption({
  location,
  selected,
  disabled,
  onSelect,
}: {
  location: BookingLocation;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <label className={`booking-location-option${selected ? ' is-selected' : ''}`}>
      <input
        type="radio"
        name="booking_location"
        value={location.id}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect(location.id)}
      />
      <span className="booking-location-option-text">
        <strong>{location.name}</strong>
        <a href={getLocationMapsUrl(location)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          View on map
        </a>
      </span>
    </label>
  );
}
