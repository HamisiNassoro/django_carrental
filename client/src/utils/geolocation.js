const DEFAULT_CENTER = { latitude: -1.2921, longitude: 36.8219 }; // Nairobi

const WATCH_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 5000,
};

const parsePosition = (position) => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy,
  speed_kmh:
    position.coords.speed != null && position.coords.speed >= 0
      ? position.coords.speed * 3.6
      : null,
  heading:
    position.coords.heading != null && position.coords.heading >= 0
      ? position.coords.heading
      : null,
});

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(parsePosition(position)),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });

/** Continuous GPS updates; returns a cleanup function. */
export const watchPosition = (onUpdate, onError) => {
  if (!navigator.geolocation) {
    onError?.(new Error("Geolocation is not supported by your browser"));
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => onUpdate(parsePosition(position)),
    (error) => onError?.(error),
    WATCH_OPTIONS
  );

  return () => navigator.geolocation.clearWatch(watchId);
};

export const getDefaultCenter = () => ({ ...DEFAULT_CENTER });

export default getCurrentPosition;
