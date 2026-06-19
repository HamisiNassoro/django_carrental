import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import CarFormWizard from "../components/cars/CarFormWizard";
import { createCar, reset } from "../features/cars/carSlice";
import carAPIService from "../features/cars/carAPIService";

const CreateCarPage = () => {
	const { isLoading, isError, message } = useSelector((state) => state.cars);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	useEffect(() => {
		if (isError && message) {
			toast.error(message, { icon: "😭" });
		}
	}, [isError, message]);

	const handleSubmit = async (formData, photos) => {
		const result = await dispatch(createCar(formData));
		if (!createCar.fulfilled.match(result)) {
			return;
		}

		const car = result.payload;
		const hasNewPhotos = Object.values(photos).some((entry) => entry?.file);

		try {
			if (hasNewPhotos && car?.slug) {
				await carAPIService.uploadCarImages(car.slug, photos);
			}
			toast.success("Car listed successfully!", { icon: "✅" });
			dispatch(reset());
			navigate("/my-cars");
		} catch (error) {
			toast.warning(
				"Car created but some photos failed to upload. You can add them from Edit.",
				{ icon: "⚠️" }
			);
			navigate("/my-cars");
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<CarFormWizard
			mode="create"
			title="Add New Car"
			subtitle="List your vehicle in four simple steps"
			isSubmitting={isLoading}
			onSubmit={handleSubmit}
			onCancel={() => navigate("/my-cars")}
		/>
	);
};

export default CreateCarPage;
