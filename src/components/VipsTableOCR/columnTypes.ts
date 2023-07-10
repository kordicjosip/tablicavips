import { Field } from './field';

export const columnTypes: { name: string; field: Field; parameter: string }[] = [
	{ name: 'Naziv artikla', field: Field.artiklPoNazivu, parameter: 'pmArtiklNaziv' },
	{ name: 'ID artikla', field: Field.artiklPoSifri, parameter: 'pmArtiklID' },
	{ name: 'Količina', field: Field.kolicina, parameter: 'pmKolicina' },
	{ name: 'Ulazna cijena', field: Field.uc, parameter: 'pmUC' },
	{ name: 'Fakturna cijena', field: Field.fc, parameter: 'pmFC' },
	{ name: 'Rabat 1', field: Field.rabat1, parameter: 'pmRabat1' },
	{ name: 'Rabat 2', field: Field.rabat2, parameter: 'pmRabat2' },
	{ name: 'Rabat 3', field: Field.rabat3, parameter: 'pmRabat3' },
	{ name: 'Nabavna cijena', field: Field.nc, parameter: 'pmNC' },
	{ name: 'VPC', field: Field.vpc, parameter: 'pmVPC' },
	{ name: 'MPC', field: Field.mpc, parameter: 'pmMPC' },
	{ name: 'PDV', field: Field.pdv, parameter: 'pmPDV' }
];
