import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailPage from "./pages/CarDetailPage";
import CarManagementPage from "./pages/CarManagementPage";
import CreateCarPage from "./pages/CreateCarPage";
import EditCarPage from "./pages/EditCarPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";

const App = () => {
	return (
		<>
			<Router>
				<Header />
				<main className="py-3">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route
							path="/login"
							element={<Login />}
						/>
						<Route
							path="/cars"
							element={<CarsPage />}
						/>
						<Route
							path="/car/:slug"
							element={<CarDetailPage />}
						/>
						<Route
							path="/my-cars"
							element={<CarManagementPage />}
						/>
						<Route
							path="/create-car"
							element={<CreateCarPage />}
						/>
						<Route
							path="/edit-car/:slug"
							element={<EditCarPage />}
						/>
						<Route
							path="/about"
							element={<AboutUsPage />}
						/>
						<Route
							path="/contact"
							element={<ContactUsPage />}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
					<ToastContainer theme="dark" />
				</main>
				<Footer />
			</Router>
		</>
	);
};

export default App;