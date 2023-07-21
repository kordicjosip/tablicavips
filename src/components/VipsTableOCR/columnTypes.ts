import { Field } from './field';

export enum Parametar {
	artikl = 'pmArtiklID'
}

export const columnTypes: {
	name: string;
	field: Field;
	parameter: string;
	defaultValue: string | number | null;
	emptyValue: Number
}[] = [
	{ name: 'ID artikla', field: Field.artiklPoSifri, parameter: Parametar.artikl, defaultValue: null, emptyValue: 0 },
	{ name: 'Količina', field: Field.numeric, parameter: 'pmKolicina', defaultValue: null, emptyValue: 0 },
	{ name: 'Ulazna cijena', field: Field.numeric, parameter: 'pmUC', defaultValue: null, emptyValue: 0 },
	{ name: 'Fakturna cijena', field: Field.numeric, parameter: 'pmFC', defaultValue: null, emptyValue: 0 },
	{ name: 'Rabat 1', field: Field.numeric, parameter: 'pmRabat1', defaultValue: 0, emptyValue: 0 },
	{ name: 'Rabat 2', field: Field.numeric, parameter: 'pmRabat2', defaultValue: 0, emptyValue: 0 },
	{ name: 'Rabat 3', field: Field.numeric, parameter: 'pmRabat3', defaultValue: 0, emptyValue: 0 },
	{ name: 'Nabavna cijena', field: Field.numeric, parameter: 'pmNC', defaultValue: null, emptyValue: 0 },
	{ name: 'VPC', field: Field.numeric, parameter: 'pmVPC', defaultValue: null, emptyValue: 0 },
	{ name: 'MPC', field: Field.numeric, parameter: 'pmMPC', defaultValue: null, emptyValue: 0 },
	{ name: 'PDV', field: Field.numeric, parameter: 'pmPDV', defaultValue: null, emptyValue: 0 }
];
