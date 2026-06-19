const DEFAULT_CENTER = { latitude: -1.2921, longitude: 36.8219 }; // Nairobi

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });

export const getDefaultCenter = () => ({ ...DEFAULT_CENTER });

export default getCurrentPosition;
