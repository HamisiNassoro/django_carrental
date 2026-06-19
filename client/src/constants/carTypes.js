export const CAR_TYPE_OPTIONS = [
	{ value: "Sedan", label: "Sedan" },
	{ value: "Sports Utility Vehicle(SUV)", label: "SUV" },
	{ value: "Hatchback", label: "Hatchback" },
	{ value: "Luxury", label: "Luxury" },
	{ value: "Convertible", label: "Convertible" },
	{ value: "Van", label: "Van" },
	{ value: "Electric", label: "Electric" },
	{ value: "Other", label: "Other" },
];

const TYPE_ALIASES = {
	suv: "Sports Utility Vehicle(SUV)",
	"sports utility vehicle": "Sports Utility Vehicle(SUV)",
	"sports utility vehicle(suv)": "Sports Utility Vehicle(SUV)",
	sedan: "Sedan",
	luxury: "Luxury",
	hatchback: "Hatchback",
	convertible: "Convertible",
	van: "Van",
	electric: "Electric",
	other: "Other",
};

export const normalizeCarTypeFilter = (value) => {
	if (!value || value === "all") return null;
	const key = String(value).toLowerCase().trim();
	return TYPE_ALIASES[key] || value;
};

export const carMatchesType = (car, filterValue) => {
	const normalized = normalizeCarTypeFilter(filterValue);
	if (!normalized) return true;
	return car.car_type?.toLowerCase() === normalized.toLowerCase();
};

export const getCarTypeLabel = (value) => {
	if (!value) return "Any type";
	const match = CAR_TYPE_OPTIONS.find(
		(option) => option.value.toLowerCase() === String(value).toLowerCase()
	);
	if (match) return match.label;
	const normalized = normalizeCarTypeFilter(value);
	const normalizedMatch = CAR_TYPE_OPTIONS.find(
		(option) => option.value === normalized
	);
	return normalizedMatch?.label || value;
};
