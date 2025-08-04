import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailPage from "./pages/CarDetailPage";
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
							path="/cars"
							element={<CarsPage />}
						/>
						<Route
							path="/car/:id"
							element={<CarDetailPage />}
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