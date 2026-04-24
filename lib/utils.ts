import dayjs from "dayjs";

export default function formatCurrency(value: number, currency = "USD") {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	} catch (error) {
		// Fallback to USD if invalid currency code
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	}
}
/*

// Examples:
console.log(formatCurrency(1234.5));           // $1,234.50
console.log(formatCurrency(1234.5, "EUR"));    // €1,234.50
console.log(formatCurrency(1234.5, "INVALID"));// $1,234.50 (fallback)
*/

export const formatSubscriptionDateTime = (value?: string): string => {
	if (!value) return "Not provided";
	const parsedDate = dayjs(value);
	return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
	if (!value) return "Unknown";
	return value.charAt(0).toUpperCase() + value.slice(1);
};