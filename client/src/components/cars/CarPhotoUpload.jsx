import React, { useRef } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import { PHOTO_SLOTS } from "./carFormConstants";
import { resolveCarImage } from "../../utils/mediaUrl";

const CarPhotoUpload = ({ photos, onChange, errors = {} }) => {
	const inputRefs = useRef({});

	const handleFileSelect = (key, event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			return;
		}

		const preview = URL.createObjectURL(file);
		onChange(key, { file, preview });
		event.target.value = "";
	};

	const handleRemove = (key) => {
		const current = photos[key];
		if (current?.preview?.startsWith("blob:")) {
			URL.revokeObjectURL(current.preview);
		}
		onChange(key, { file: null, preview: null });
	};

	return (
		<div className="photo-upload-grid">
			{PHOTO_SLOTS.map((slot, index) => {
				const entry = photos[slot.key] || {};
				const preview = entry.preview
					? entry.file
						? entry.preview
						: resolveCarImage(entry.preview)
					: null;
				const hasImage = Boolean(preview);

				return (
					<div
						key={slot.key}
						className={`photo-upload-slot ${index === 0 ? "photo-upload-slot--cover" : ""} ${
							hasImage ? "photo-upload-slot--filled" : ""
						}`}
					>
						<input
							ref={(el) => {
								inputRefs.current[slot.key] = el;
							}}
							type="file"
							accept="image/*"
							className="photo-upload-input"
							onChange={(e) => handleFileSelect(slot.key, e)}
						/>

						{hasImage ? (
							<>
								<img
									src={preview}
									alt={slot.label}
									className="photo-upload-preview"
									onError={(e) => {
										e.currentTarget.src = resolveCarImage(null);
									}}
								/>
								<button
									type="button"
									className="photo-upload-remove"
									onClick={() => handleRemove(slot.key)}
									aria-label={`Remove ${slot.label}`}
								>
									<FaTimes />
								</button>
							</>
						) : (
							<button
								type="button"
								className="photo-upload-trigger"
								onClick={() => inputRefs.current[slot.key]?.click()}
							>
								<FaCamera />
								<span className="photo-upload-label">{slot.label}</span>
								<span className="photo-upload-hint">{slot.hint}</span>
								{slot.required && (
									<span className="photo-upload-required">Required</span>
								)}
							</button>
						)}

						{errors[slot.key] && (
							<div className="photo-upload-error">{errors[slot.key]}</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export const buildEmptyPhotos = () =>
	PHOTO_SLOTS.reduce((acc, slot) => {
		acc[slot.key] = { file: null, preview: null };
		return acc;
	}, {});

export const buildPhotosFromCar = (car = {}) =>
	PHOTO_SLOTS.reduce((acc, slot) => {
		const url = car[slot.key] || null;
		acc[slot.key] = { file: null, preview: url };
		return acc;
	}, {});

export default CarPhotoUpload;
