export function validateInputNumeric(text: string) {
	text = text.replace(',', '.');
	if (!/^\d+(.\d+)?$/.test(text)) {
		return null;
	}
	return Number.parseFloat(text);
}

export function validateColumnRegex(
	text: string,
	regexString: string = 'Barkod: (\\d+)',
	initial = true
) {
	const pattern = new RegExp(regexString);
	const matchString = String(text).match(pattern);
	if (matchString) {
		return matchString[1];
	} else {
		if (initial) {
			return '';
		}
		return text;
	}
}
