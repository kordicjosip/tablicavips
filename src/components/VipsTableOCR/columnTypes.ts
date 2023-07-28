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

export const columnTypes: {
	name: string;
	field: Field;
	parameter: string;
	defaultValue: string | number | null;
	emptyValue: Number
}[] = [
	{ name: 'Šifra artikla', field: Field.artiklPoSifri, parameter: Parametar.artikl, defaultValue: null, emptyValue: 0 },
	{ name: 'Kataloški broj', field: Field.artiklPoKataloskomBroju, parameter: Parametar.artikl, defaultValue: null, emptyValue: 0 },
	{ name: 'Barkod', field: Field.artiklPoBarKodu, parameter: Parametar.artikl, defaultValue: null, emptyValue: 0 },
	{ name: 'Količina', field: Field.numeric, parameter: Parametar.kolicina, defaultValue: null, emptyValue: 0 },
	{ name: 'Ulazna cijena', field: Field.numeric, parameter: Parametar.ulaznaCijena, defaultValue: null, emptyValue: 0 },
	{ name: 'Fakturna cijena', field: Field.numeric, parameter: Parametar.fakturnaCijena, defaultValue: null, emptyValue: 0 },
	{ name: 'Rabat 1', field: Field.numeric, parameter: Parametar.rabat1, defaultValue: 0, emptyValue: 0 },
	{ name: 'Rabat 2', field: Field.numeric, parameter: Parametar.rabat2, defaultValue: 0, emptyValue: 0 },
	{ name: 'Rabat 3', field: Field.numeric, parameter: Parametar.rabat3, defaultValue: 0, emptyValue: 0 },
	{ name: 'Prelevman', field: Field.numeric, parameter: Parametar.prelevman, defaultValue: 0, emptyValue: 0 },
	{ name: 'Trosarina', field: Field.numeric, parameter: Parametar.trosarina, defaultValue: 0, emptyValue: 0 },
	{ name: 'Carina', field: Field.numeric, parameter: Parametar.carina, defaultValue: 0, emptyValue: 0 },
	{ name: 'Nabavna cijena', field: Field.numeric, parameter: Parametar.nabavnaCijena, defaultValue: null, emptyValue: 0 },
	{ name: 'VPC', field: Field.numeric, parameter: Parametar.vpc, defaultValue: null, emptyValue: 0 },
	{ name: 'MPC', field: Field.numeric, parameter: Parametar.mpc, defaultValue: null, emptyValue: 0 },
	{ name: 'PDV', field: Field.numeric, parameter: Parametar.pdv, defaultValue: null, emptyValue: 0 }
];
