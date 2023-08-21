import { Field } from './field';

export enum Parametar {
	artikl = 'pmArtiklID',
	kolicina = 'pmKolicina',
	ulaznaCijena = 'pmUC',
	fakturnaCijena = 'pmFC',
	rabat1 = 'pmRabat1',
	rabat2 = 'pmRabat2',
	rabat3 = 'pmRabat3',
	prelevman = 'pmPrelevman',
	trosarina = 'pmTrosarina',
	carina = 'pmCarina',
	nabavnaCijena = 'pmNC',
	vpc = 'pmVPC',
	mpc = 'pmMPC',
	pdv = 'pmPDV'
}

export const columnOrder = [
	'pmArtiklID',
	'pmKolicina',
	'pmUC',
	'pmFC',
	'pmRabat1',
	'pmRabat2',
	'pmRabat3',
	'pmPrelevman',
	'pmTrosarina',
	'pmCarina',
	'pmNC',
	'pmVPC',
	'pmMPC',
	'pmPDV'
];

export const columnTypes: {
	name: string;
	field: Field;
	parameter: string;
	regexString: string | null;
	defaultValue: string | number | null;
	emptyValue: number | null
}[] = [
	{ name: 'Šifra artikla', field: Field.artiklPoSifri, parameter: Parametar.artikl, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'Kataloški broj', field: Field.artiklPoKataloskomBroju, parameter: Parametar.artikl, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'Barkod', field: Field.artiklPoBarKodu, parameter: Parametar.artikl, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'Količina', field: Field.numeric, parameter: Parametar.kolicina, regexString:null, defaultValue: null, emptyValue: 1 },
	{ name: 'Ulazna cijena', field: Field.numeric, parameter: Parametar.ulaznaCijena, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'Fakturna cijena', field: Field.numeric, parameter: Parametar.fakturnaCijena, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'Rabat 1', field: Field.numeric, parameter: Parametar.rabat1, regexString:null, defaultValue: 0, emptyValue: 0 },
	{ name: 'Rabat 2', field: Field.numeric, parameter: Parametar.rabat2, regexString:null, defaultValue: 0, emptyValue: 0 },
	{ name: 'Rabat 3', field: Field.numeric, parameter: Parametar.rabat3, regexString:null, defaultValue: 0, emptyValue: 0 },
	{ name: 'Prelevman', field: Field.numeric, parameter: Parametar.prelevman, regexString:null, defaultValue: 0, emptyValue: 0 },
	{ name: 'Trosarina', field: Field.numeric, parameter: Parametar.trosarina, regexString:null, defaultValue: 0, emptyValue: 0 },
	{ name: 'Carina', field: Field.numeric, parameter: Parametar.carina, regexString:null, defaultValue: 0, emptyValue: 0 },
	{ name: 'Nabavna cijena', field: Field.numeric, parameter: Parametar.nabavnaCijena, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'VPC', field: Field.numeric, parameter: Parametar.vpc, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'MPC', field: Field.numeric, parameter: Parametar.mpc, regexString:null, defaultValue: null, emptyValue: null },
	{ name: 'PDV', field: Field.numeric, parameter: Parametar.pdv, regexString:null, defaultValue: null, emptyValue: null }
];
