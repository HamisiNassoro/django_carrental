import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import CarFormWizard from "../components/cars/CarFormWizard";
import { INITIAL_FORM_DATA } from "../components/cars/carFormConstants";
import { getCar, updateCar, reset } from "../features/cars/carSlice";
import carAPIService from "../features/cars/carAPIService";

const EditCarPage = () => {
	const { slug } = useParams();
	const { car, isLoading, isError, message } = useSelector((state) => state.cars);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (slug) {
			dispatch(getCar(slug));
		}
	}, [dispatch, slug]);

	useEffect(() => {
		if (isError && message) {
			toast.error(message, { icon: "😭" });
		}
	}, [isError, message]);

	const initialFormData = useMemo(() => {
		if (!car || !Object.keys(car).length) {
			return null;
		}

		const coords = car.location?.coordinates;

		return {
			...INITIAL_FORM_DATA,
			title: car.title || "",
			description: car.description || "",
			country: car.country || "KE",
			city: car.city || "Nairobi",
			postal_code: car.postal_code || "140",
			street_address: car.street_address || "KG8 Avenue",
			car_number: car.car_number || "",
			price: car.price || "",
			tax: car.tax || "0.15",
			total_seats: car.total_seats || "",
			advert_type: car.advert_type || "For Rent",
			car_type: car.car_type || "Other",
			published_status: car.published_status ?? true,
			latitude: coords ? coords[1] : "",
			longitude: coords ? coords[0] : "",
			is_available: car.is_available ?? true,
		};
	}, [car]);

	const handleSubmit = async (formData, photos) => {
		const { latitude, longitude, ...carData } = formData;
		const result = await dispatch(updateCar({ slug, carData }));

		if (!updateCar.fulfilled.match(result)) {
			return;
		}

		try {
			if (latitude && longitude) {
				await carAPIService.updateCarLocation(slug, {
					latitude: Number(latitude),
					longitude: Number(longitude),
					city: formData.city,
				});
			}

			const hasNewPhotos = Object.values(photos).some((entry) => entry?.file);
			if (hasNewPhotos) {
				await carAPIService.uploadCarImages(slug, photos);
			}

			toast.success("Car updated successfully!", { icon: "✅" });
			dispatch(reset());
			navigate("/my-cars");
		} catch (error) {
			toast.warning(
				"Car details saved but photos or location may need another try.",
				{ icon: "⚠️" }
			);
			navigate("/my-cars");
		}
	};

	if (isLoading || !initialFormData) {
		return <Spinner />;
	}

	return (
		<CarFormWizard
			mode="edit"
			title="Edit Car"
			subtitle="Update your listing details and photos"
			initialFormData={initialFormData}
			initialCar={car}
			isSubmitting={isLoading}
			onSubmit={handleSubmit}
			onCancel={() => navigate("/my-cars")}
		/>
	);
};

export default EditCarPage;
