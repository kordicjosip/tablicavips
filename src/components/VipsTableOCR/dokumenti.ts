// @ts-ignore
import { Parametar } from '$components/VipsTableOCR/columnTypes';

export const dokumenti = {
	//1 Račun | primjer: 00105006-000001/22
	1: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.vpc, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.mpc]
	},
	//2 Predračun | primjer: 00105007-000001/22
	2: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.vpc, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.mpc]
	},
	//3 Otpremnica | primjer: 00104008-000001/21
	3: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina]
	},
	//4 Ponuda | primjer: 00106009-000001/23
	4: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.vpc, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.mpc]
	},
	//6 Primka | primjer: 00201011-000001/21
	6: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina]
	},
	// 7 Kalkulacija - Strani dobavljač | primjer: 00201012-000001/21
	7: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.fakturnaCijena, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.ulaznaCijena, Parametar.prelevman, Parametar.trosarina, Parametar.vpc, Parametar.mpc]
	},
	//13 Povratnica dobavljaču | primjer: nema na TestDB
	13: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.mpc]
	},
	//16 Reklamirani račun | primjer: 00104021-000001/21
	16: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.vpc, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.mpc]
	},
	//28 Trebovnica | primjer: nema na TestDB
	28: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina]
	},
	// 36 Kalkulacija - Domaći dobavljač | primjer: 00202043-000001/22
	36: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.fakturnaCijena, Parametar.rabat1, Parametar.rabat2, Parametar.rabat3, Parametar.ulaznaCijena, Parametar.vpc, Parametar.mpc]
	},
	//39 Narudžbenica kupca | primjer: 00104048-000001/21
	39: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina]
	},
	//41 Nalog za otkup | primjer: 00105052-000001/22
	41: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.fakturnaCijena]
	},
	//44 Ugovorena roba | primjer: nema na TestDB
	44: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina, Parametar.fakturnaCijena]
	},
	//51 Povrat po otpremnici | primjer: 00202062-000001/22
	51: {
		potrebniParametri: [Parametar.artikl, Parametar.kolicina]
	},

};
