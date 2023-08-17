export function validateInputNumeric(text: string) {
	text = text.replace(',', '.');
	if (!/^\d+(.\d+)?$/.test(text)) {
		return null;
	}
	return Number.parseFloat(text);
}

export function validateThousands(text: string) {
	// 1,123.00
	if (!/^-?(\d+|\d{1,3}(\.\d{3})+)(,(\s)?\d*)?$/gm.test(text)) {
		// 1.123,00
		if (!/^-?(\d+|\d{1,3}(,\d{3})+)(\.(\s)?\d*)?$/gm.test(text)) {
			return text;
		} else {
			return text.replaceAll(',', '');
		}
	} else {
		return text.replaceAll('.', '');
	}
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
