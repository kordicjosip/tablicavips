import { Field } from './field';

export const columnTypes: {
	name: string;
	field: Field;
	parameter: string;
	defaultValue: string | number | null;
}[] = [
	{ name: 'ID artikla', field: Field.artiklPoSifri, parameter: 'pmArtiklID', defaultValue: null },
	{ name: 'Količina', field: Field.numeric, parameter: 'pmKolicina', defaultValue: null },
	{ name: 'Ulazna cijena', field: Field.numeric, parameter: 'pmUC', defaultValue: null },
	{ name: 'Fakturna cijena', field: Field.numeric, parameter: 'pmFC', defaultValue: null },
	{ name: 'Rabat 1', field: Field.numeric, parameter: 'pmRabat1', defaultValue: 0 },
	{ name: 'Rabat 2', field: Field.numeric, parameter: 'pmRabat2', defaultValue: null },
	{ name: 'Rabat 3', field: Field.numeric, parameter: 'pmRabat3', defaultValue: null },
	{ name: 'Nabavna cijena', field: Field.numeric, parameter: 'pmNC', defaultValue: null },
	{ name: 'VPC', field: Field.numeric, parameter: 'pmVPC', defaultValue: null },
	{ name: 'MPC', field: Field.numeric, parameter: 'pmMPC', defaultValue: null },
	{ name: 'PDV', field: Field.numeric, parameter: 'pmPDV', defaultValue: null }
];
