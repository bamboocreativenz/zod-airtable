import AirtableSDK from "airtable"

import { RecordZ } from "./types/record"
import { SchemaZodT } from "./types/schema"

export interface GetRecordsById<T extends SchemaZodT> {
	recordIds: string[]
	tableId: string
	baseId: string
	schema: T
	airtable: AirtableSDK | string
}

//TODO Add jsdoc as the types are not clear
export async function getRecordsById<T extends SchemaZodT>({
	tableId,
	baseId,
	schema,
	airtable,
	recordIds,
}: GetRecordsById<T>) {
	let _airtable: AirtableSDK
	if (airtable instanceof AirtableSDK) {
		_airtable = airtable
	} else {
		airtable = new AirtableSDK({ apiKey: airtable })
	}

	// we overwrite the base RecordZ fields with the specific schema provided
	const recordWithSchema = RecordZ.extend({
		fields: schema,
	})

	//TODO Consider moving to Promise.settled to account for request errors (how does airtable sdk handle this in .all() function?)
	//DL Noticing: Here is a case where we are relying on the Airtable SDK to manage rate limiting/throttling and retrys
	const records = await Promise.all(
		recordIds.map(async (id) => {
			return _airtable.base(baseId).table(tableId).find(id)
		})
	)
	return await Promise.all(
		records.map((r) => {
			return recordWithSchema.safeParseAsync(r)
		})
	)
}
