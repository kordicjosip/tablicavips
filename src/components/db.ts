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

export async function testaaa() {
	try {
		await sql.connect(sqlConfig);
	} catch (err) {
		throw error(500, { message: 'greška' });
	}

	const result =
		await sql.query`SELECT TOP (10) [ID], [Sifra], [Naziv], [PorezID], [PodGrupaID], [ProizvodjacID], [JmjID], [AmortStopaID] FROM [Test].[dbo].[tbArt]`;

	return result;
}
