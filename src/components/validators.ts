export function validateInputNumeric(text: string) {
	text = text.replace(',', '.');
	if (!/^\d+(.\d+)?/.test(text)) {
		return null;
	}
	return Number.parseFloat(text);
}
