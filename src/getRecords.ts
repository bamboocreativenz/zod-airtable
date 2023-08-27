// IDEA: getRecords handles cases of:
// [x] getting all records from a table
// [x] getting specific records from a table (single or multiple)
// the difference is handled by either supplying a set of record id's or not
// (and other params like filterByFormula etc)

// also - can either call this once the airtable singleton has been set up (in which case "airtable" is passed to the function under the hood), or call it by itself and pass the api key explicitly

import AirtableSDK from "airtable"

import { RecordZ } from "./types/record"
import { SchemaZodT } from "./types/schema"
import { SelectQueryParamsT } from "./types/queryParams"

export interface GetRecords<T extends SchemaZodT> {
	airtable: AirtableSDK | string
	baseId: string
	tableId: string
	schema: T
	query?: SelectQueryParamsT
}

//TODO Add jsdoc as the types are not clear
export function getRecords<T extends SchemaZodT>({
	tableId,
	baseId,
	schema,
	airtable,
	query,
}: GetRecords<T>) {
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
	return airtable
		.base(baseId)
		.table(tableId)
		.select(query)
		.all()
		.then((records) => {
			return Promise.all(
				records.map((r) => {
					return recordWithSchema.safeParseAsync(r)
				})
			)
		})
}
