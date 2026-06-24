import { useCallback, useEffect, useRef } from "react";
import { watchPosition } from "../utils/geolocation";
import bookingLocationAPIService from "../features/bookings/bookingLocationAPIService";

const PING_INTERVAL_MS = 15_000;

const useTripLocationSharing = (booking) => {
  const lastPingAtRef = useRef(0);
  const pendingRef = useRef(false);
  const active =
    booking?.status === "ACTIVE" && Boolean(booking?.location_sharing_enabled);

  const maybeSendPing = useCallback(
    async (position) => {
      if (!booking?.pkid || !active) return;

      const now = Date.now();
      if (pendingRef.current || now - lastPingAtRef.current < PING_INTERVAL_MS) {
        return;
      }

      pendingRef.current = true;
      try {
        await bookingLocationAPIService.sendLocationPing(booking.pkid, {
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy_m: position.accuracy,
          speed_kmh: position.speed_kmh,
          heading: position.heading,
        });
        lastPingAtRef.current = Date.now();
      } catch {
        // Geolocation or network errors are non-fatal; next update retries.
      } finally {
        pendingRef.current = false;
      }
    },
    [booking?.pkid, active]
  );

  useEffect(() => {
    if (!active) {
      lastPingAtRef.current = 0;
      return undefined;
    }

    lastPingAtRef.current = 0;

    const stopWatch = watchPosition(
      (position) => {
        maybeSendPing(position);
      },
      () => {}
    );

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        lastPingAtRef.current = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopWatch();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active, maybeSendPing]);

  return { isSharing: active };
};

export default useTripLocationSharing;
