import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookings } from "../features/bookings/bookingSlice";
import useTripLocationSharing from "../hooks/useTripLocationSharing";

const TripLocationSharingSession = ({ booking }) => {
  useTripLocationSharing(booking);
  return null;
};

/** Keeps GPS pings running app-wide while a renter has sharing enabled. */
const TripLocationSharingRunner = () => {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.auth);
  const { myBookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (!isInitialized || !user) return undefined;

    dispatch(getMyBookings());
    const timer = setInterval(() => dispatch(getMyBookings()), 120_000);
    return () => clearInterval(timer);
  }, [dispatch, isInitialized, user]);

  if (!user) return null;

  const activeSharing = (myBookings || []).filter(
    (booking) =>
      booking.status === "ACTIVE" && booking.location_sharing_enabled
  );

  return (
    <>
      {activeSharing.map((booking) => (
        <TripLocationSharingSession key={booking.pkid} booking={booking} />
      ))}
    </>
  );
};

export default TripLocationSharingRunner;
