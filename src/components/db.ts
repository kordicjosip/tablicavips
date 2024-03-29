import { env } from '$env/dynamic/private';
import sql from 'mssql';

const sqlConfig = {
	user: env.DB_USERNAME,
	password: env.DB_PASSWORD,
	database: env.DB,
	server: env.DB_HOST!,
	port: Number(env.DB_PORT),
	connectionTimeout: 60000,
	requestTimeout: 180000,
	pool: {
		max: 100,
		min: 2,
		idleTimeoutMillis: 30000
	},
	options: {
		encrypt: false,
		trustServerCertificate: true
	}
};

export let pool: sql.ConnectionPool;

export async function init() {
	pool = await sql.connect(sqlConfig);
}

export async function getArtiklPoSifri(
	sifra: string
): Promise<{ ID: number; Naziv: string } | undefined> {
	const result = await pool
		.request()
		.input('sifra', sifra)
		.query(`SELECT TOP 1 [ID], [Naziv] FROM [Test].[dbo].[tbArt] WHERE [Sifra] = @sifra`);
	if (result.recordset.length === 0) return undefined;
	return {
		ID: result.recordset[0]?.ID,
		Naziv: result.recordset[0]?.Naziv
	};
}

export async function getArtiklPoKataloskomBroju(
	katBroj: string
): Promise<{ ID: number; Naziv: string } | undefined> {
	const result = await pool
		.request()
		.input('katBroj', katBroj)
		.query(`SELECT TOP 1 [ID], [Naziv] FROM [Test].[dbo].[tbArt] WHERE [KataloskiBroj] = @katBroj`);
	if (result.recordset.length === 0) return undefined;
	return {
		ID: result.recordset[0]?.ID,
		Naziv: result.recordset[0]?.Naziv
	};
}

export async function getArtiklPoBarKodu(
	Barcode: string
): Promise<{ ID: number; Naziv: string } | undefined> {
	const result = await pool
		.request()
		.input('Barcode', Barcode)
		.query(
			`SELECT TOP 1 [ID], [Naziv] FROM [Test].[dbo].[tbArtBcd] LEFT JOIN [tbArt] ON [tbArt].ID = [tbArtBcd].ArtiklID WHERE [Barcode] = @Barcode`
		);
	if (result.recordset.length === 0) return undefined;
	return {
		ID: result.recordset[0]?.ID,
		Naziv: result.recordset[0]?.Naziv
	};
}

export async function getArtiklPoId(id: number, pjID: number) {
	const result = await pool
		.request()
		.input('artiklId', id)
		.input('pjID', pjID)
		.query(
			`SELECT TOP 1 * FROM [Test].[dbo].[tbArt] INNER JOIN [Test].[dbo].[tbArtStnSkl] ON tbArt.ID = tbArtStnSkl.ArtiklID WHERE [ArtiklID] = @artiklId AND PjID = @pjID`
		);
	if (result.recordset.length === 0) return undefined;
	return {
		ID: result.recordset[0]?.ID,
		Naziv: result.recordset[0]?.Naziv,
		NC: result.recordset[0]?.NC,
		VPC: result.recordset[0]?.VPC,
		MPC: result.recordset[0]?.MPC,
		PrzID: result.recordset[0]?.PrzID
	};
}

export async function getVipsDocument(dokUID: string): Promise<any | undefined> {
	let dokID = await pool
		.request()
		.input('dokUID', dokUID)
		.query(`SELECT TOP 1 [ID] FROM [Test].[dbo].[tbRbnZgl] WHERE [DokUID] = @dokUID`);
	if (dokID.recordset.length === 0) return undefined;
	dokID = dokID.recordset[0]?.ID;

	const result = await pool
		.request()
		.input('pmDltID', 1)
		.input('pmRbnZglID', dokID)
		.input('pmDatumKreiranja', null)
		.execute('spRbnZglCntBarSel2');

	return result.recordset[0];
}
