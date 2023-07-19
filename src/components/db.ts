import { env } from '$env/dynamic/private';
import sql from 'mssql';
import { error } from '@sveltejs/kit';

const sqlConfig = {
	user: env.DB_USERNAME,
	password: env.DB_PASSWORD,
	database: env.DB,
	server: env.DB_HOST,
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

export async function sendDataToVips() {
	try {
		await sql.connect(sqlConfig);
	} catch (err) {
		throw error(500, { message: 'greška' });
	}

	const result = await sql.query`USE [Test]

DECLARE @pmPjID int
DECLARE @RC int
DECLARE @pmDltID int
DECLARE @pmAkcID tinyint
DECLARE @pmID int
DECLARE @pmZaglavljeID int
DECLARE @pmArtiklID int
DECLARE @pmArtiklNaziv nvarchar(200)
DECLARE @pmKolicina [dbo].[dtKol]
DECLARE @pmDevUC [dbo].[dtCur]
DECLARE @pmFC [dbo].[dtCur]
DECLARE @pmRabat1 [dbo].[dtSmlDcm]
DECLARE @pmRabat2 [dbo].[dtSmlDcm]
DECLARE @pmRabat3 [dbo].[dtSmlDcm]
DECLARE @pmUC [dbo].[dtCur]
DECLARE @pmCarina [dbo].[dtSmlDcm]
DECLARE @pmPrelevman [dbo].[dtCur]
DECLARE @pmTrosarina [dbo].[dtCur]
DECLARE @pmOstaliTrosak [dbo].[dtCur]
DECLARE @pmNC [dbo].[dtCur]
DECLARE @pmVPC [dbo].[dtCur]
DECLARE @pmMPC [dbo].[dtCur]
DECLARE @pmPDV [dbo].[dtCur]
DECLARE @pmPorezID int
DECLARE @pmRabatTip bit
DECLARE @pmBrziUnos bit
DECLARE @pmErr int
DECLARE @pmErrMsg nvarchar(max)

SET @pmArtiklID = 7 -- ID Odabranog artikla
SET @pmPjID = 1 -- ID Poslovne jedinice na kojoj se radi

-- Ako je bilo koji dokument
SELECT
	@pmNC = [NC],
    @pmVPC = [VPC],
    @pmMPC = [MPC],
    @pmPorezID = [PrzID]
  FROM [Test].[dbo].[tbArtStnSkl]
  WHERE ArtiklID = @pmArtiklID AND PjID = @pmPjID
-- Ako je kalkulacija vrijednosti treba unijeti
SET @pmNC = 0  -- Nabavna cijena
SET @pmVPC = 0  -- Veleprodajna cijena
SET @pmMPC = 0  -- Maloprodajna cijena
SET @pmPorezID = 0


SET @pmDltID = 1 -- 1 = Servisni Korisnik
SET @pmAkcID = 0 -- 0 = Dodavanje
SET @pmID = 0 -- ID Stavke (ako je uređivanje ili brisanje)
SET @pmZaglavljeID = 432363 -- ID Dokumenta
SET @pmArtiklNaziv = N'Roba po dokumentu' -- Naziv odabranog artikla (može biti drugačiji od pravog naziva)
SET @pmKolicina = 1 -- Količina artikla
SET @pmDevUC = 0
SET @pmFC = 0
SET @pmRabat1 = 0 -- Rabat 1 u %
SET @pmRabat2 = 0 -- Rabat 2 u %
SET @pmRabat3 = 0 -- Rabat 3 u %
SET @pmUC = 0
SET @pmCarina = 0
SET @pmPrelevman = 0
SET @pmTrosarina = 0
SET @pmOstaliTrosak = 0
SET @pmPDV = 0  -- Iznos PDV-a
SET @pmRabatTip = 0
SET @pmBrziUnos = 0

EXECUTE @RC = [dbo].[spRbnStvMod]
   @pmDltID
  ,@pmAkcID
  ,@pmID
  ,@pmZaglavljeID
  ,@pmArtiklID
  ,@pmArtiklNaziv
  ,@pmKolicina
  ,@pmDevUC
  ,@pmFC
  ,@pmRabat1
  ,@pmRabat2
  ,@pmRabat3
  ,@pmUC
  ,@pmCarina
  ,@pmPrelevman
  ,@pmTrosarina
  ,@pmOstaliTrosak
  ,@pmNC
  ,@pmVPC
  ,@pmMPC
  ,@pmPDV
  ,@pmPorezID
  ,@pmRabatTip
  ,@pmBrziUnos
  ,@pmErr OUTPUT
  ,@pmErrMsg OUTPUT

SELECT @pmErr, @pmErrMsg
GO
`;
	return result;
}
