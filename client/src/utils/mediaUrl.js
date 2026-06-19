const API_ORIGIN =
	process.env.REACT_APP_API_ORIGIN ||
	process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, "") ||
	"http://localhost:8000";

export const PLACEHOLDER_CAR_IMAGE =
	"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";

/**
 * Turn API media paths into browser-loadable URLs.
 * Django returns /mediafiles/... which must be loaded from the backend host.
 */
export const resolveMediaUrl = (url) => {
	if (!url) return null;

	if (url.startsWith("http://") || url.startsWith("https://")) {
		return url;
	}

	if (url.startsWith("/")) {
		return `${API_ORIGIN}${url}`;
	}

	return `${API_ORIGIN}/${url}`;
};

export const resolveCarImage = (url) => resolveMediaUrl(url) || PLACEHOLDER_CAR_IMAGE;
