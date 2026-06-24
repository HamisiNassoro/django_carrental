import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import PhoneLogin from "./components/PhoneLogin";
import Register from "./components/Register";
import AuthTest from "./components/AuthTest";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthInitializer from "./components/AuthInitializer";
import TripLocationSharingRunner from "./components/TripLocationSharingRunner";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailPage from "./pages/CarDetailPage";
import CarManagementPage from "./pages/CarManagementPage";
import CreateCarPage from "./pages/CreateCarPage";
import EditCarPage from "./pages/EditCarPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import NearbyPage from "./pages/NearbyPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";

const App = () => {
	return (
		<Router>
			<AuthInitializer>
				<TripLocationSharingRunner />
				<Header />
				<main className="py-3">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<Login />} />
						<Route path="/login/phone" element={<PhoneLogin />} />
						<Route path="/register" element={<Register />} />
						<Route path="/auth-test" element={<AuthTest />} />
						<Route path="/cars" element={<CarsPage />} />
						<Route path="/nearby" element={<NearbyPage />} />
						<Route path="/car/:slug" element={<CarDetailPage />} />
						<Route
							path="/my-cars"
							element={
								<ProtectedRoute>
									<CarManagementPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/create-car"
							element={
								<ProtectedRoute>
									<CreateCarPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/edit-car/:slug"
							element={
								<ProtectedRoute>
									<EditCarPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/my-bookings"
							element={
								<ProtectedRoute>
									<MyBookingsPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/owner-bookings"
							element={
								<ProtectedRoute>
									<OwnerBookingsPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<ProfileSettingsPage />
								</ProtectedRoute>
							}
						/>
						<Route path="/about" element={<AboutUsPage />} />
						<Route path="/contact" element={<ContactUsPage />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					<ToastContainer theme="dark" />
				</main>
				<Footer />
			</AuthInitializer>
		</Router>
	);
};

export default App;
