export function validateInputNumeric(text: string) {
	text = text.replace(',', '.');
	if (!/^\d+(.\d+)?$/.test(text)) {
		return null;
	}
	return Number.parseFloat(text);
}

export function validateColumnRegex(text: string, regexString: string) {
	const pattern = new RegExp(`(?<=${regexString}).*`, 'g');
	return String(text).match(pattern);
}
