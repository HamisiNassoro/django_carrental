export const INITIAL_FORM_DATA = {
	title: "",
	description: "",
	country: "KE",
	city: "Nairobi",
	postal_code: "140",
	street_address: "KG8 Avenue",
	car_number: "",
	price: "",
	tax: "0.15",
	total_seats: "",
	advert_type: "For Rent",
	car_type: "Other",
	published_status: true,
	latitude: "",
	longitude: "",
	is_available: true,
};

export const WIZARD_STEPS = [
	{ id: "basics", label: "Vehicle" },
	{ id: "pricing", label: "Pricing" },
	{ id: "location", label: "Location" },
	{ id: "photos", label: "Photos" },
];

export const PHOTO_SLOTS = [
	{
		key: "cover_photo",
		label: "Cover Photo",
		hint: "Main image shown in search results",
		required: true,
	},
	{ key: "photo1", label: "Photo 2", hint: "Exterior side view" },
	{ key: "photo2", label: "Photo 3", hint: "Interior / dashboard" },
	{ key: "photo3", label: "Photo 4", hint: "Rear or trunk" },
	{ key: "photo4", label: "Photo 5", hint: "Additional angle" },
];

export const CAR_TYPE_OPTIONS = [
	"Sedan",
	"Sports Utility Vehicle(SUV)",
	"Hatchback",
	"Luxury",
	"Convertible",
	"Van",
	"Electric",
	"Other",
];
