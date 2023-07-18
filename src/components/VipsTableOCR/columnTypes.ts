import { Field } from './field';

export const columnTypes: { name: string; field: Field; parameter: string }[] = [
	{ name: 'ID artikla', field: Field.artiklPoSifri, parameter: 'pmArtiklID' },
	{ name: 'Naziv artikla', field: Field.text, parameter: 'pmArtiklNaziv' },
	{ name: 'Količina', field: Field.numeric, parameter: 'pmKolicina' },
	{ name: 'Ulazna cijena', field: Field.numeric, parameter: 'pmUC' },
	{ name: 'Fakturna cijena', field: Field.numeric, parameter: 'pmFC' },
	{ name: 'Rabat 1', field: Field.numeric, parameter: 'pmRabat1' },
	{ name: 'Rabat 2', field: Field.numeric, parameter: 'pmRabat2' },
	{ name: 'Rabat 3', field: Field.numeric, parameter: 'pmRabat3' },
	{ name: 'Nabavna cijena', field: Field.numeric, parameter: 'pmNC' },
	{ name: 'VPC', field: Field.numeric, parameter: 'pmVPC' },
	{ name: 'MPC', field: Field.numeric, parameter: 'pmMPC' },
	{ name: 'PDV', field: Field.numeric, parameter: 'pmPDV' }
];
