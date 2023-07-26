// @ts-ignore
import { getArtiklPoId, getVipsDocument, pool } from '$components/db';
import type { RequestHandler } from '@sveltejs/kit';
import { Parametar } from '$components/VipsTableOCR/columnTypes';
import sql from 'mssql';

export const GET: RequestHandler = async ({ params }) => {
	const dokument = await getVipsDocument(params.document);
	return new Response(dokument ? JSON.stringify(dokument) : 'null', {
		headers: {
			'content-type': 'text/json'
		}
	});
};

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const dokument = await getVipsDocument(params.document);
	if (dokument['DokZakljucen']) {
		return new Response(JSON.stringify({ message: 'Dokument je već zaključen' }), {
			status: 400
		});
	}

	const parametarArtikl = Object.entries(body).find(([k, v]) => k === Parametar.artikl);
	if (parametarArtikl) {
		const artikl = await getArtiklPoId(parametarArtikl[1], dokument['PJ Firme ID']);
		if (!artikl) {
			return new Response(JSON.stringify({ message: 'Artikl nije pronađen' }), {
				status: 400
			});
		} else {
			if (!('pmNC' in body)) {
				body['pmNC'] = artikl['NC'];
			}
			if (!('pmVPC' in body)) {
				body['pmVPC'] = artikl['VPC'];
			}
			if (!('pmMPC' in body)) {
				body['pmMPC'] = artikl['MPC'];
			}
			if (!('pmPorezID' in body)) {
				body['pmPorezID'] = artikl['PrzID'];
			}
			if (!('pmArtiklNaziv' in body)) {
				body['pmArtiklNaziv'] = artikl['Naziv'];
			}
		}
	}

	let query = pool.request();
	query = query.input('pmDltID', 1);
	query = query.input('pmAkcID', 0);
	query = query.input('pmZaglavljeID', dokument['Dokument ID']);
	for (const param of Object.keys(body)) {
		query = query.input(param, body[param]);
	}
	query.output('pmErr', sql.Int);
	query.output('pmErrMsg', sql.VarChar(255));
	const response = await query.execute('spRbnStvMod');
	return new Response();
};
