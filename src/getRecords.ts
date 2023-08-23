// IDEA: getRecords handles cases of:
// - getting all records from a table
// - getting specific records from a table (single or multiple)
// the difference is handled by either supplying a set of record id's or not
// (and other params like filterByFormula etc)

// also - can either call this once the airtable singleton has been set up (in which case "airtable" is passed to the function under the hood), or call it by itself and pass the api key explicitly

import AirtableSDK from "airtable"

import { RecordZ } from "./types/record"
import { SchemaZodT } from "./types/schema"
import { SelectQueryParamsT } from "./types/queryParams"

export interface GetRecords<T extends SchemaZodT> {
	tableId: string
	baseId: string
	schema: T
	query?: SelectQueryParamsT
}

export interface GetRecordsWithAirtable<T extends SchemaZodT> extends GetRecords<T> {
	airtable: AirtableSDK
}
export interface GetRecordsWithApiKey<T extends SchemaZodT> extends GetRecords<T> {
	apiKey: string
}

export function getRecords<T extends SchemaZodT> ({
	tableId,
	schema,
	baseId,
	query,
	...otherArgs
}: GetRecordsWithAirtable<T> | GetRecordsWithApiKey<T>) {
	let airtable
	if ("airtable" in otherArgs) {
		airtable = otherArgs.airtable
	} else {
		airtable = new AirtableSDK({ apiKey: otherArgs.apiKey })
	}

	// we overwrite the base RecordZ fields with the specific schema provided
	const recordWithSchema = RecordZ.extend({
		fields: schema
	})

	return airtable.base(baseId).table(tableId).select(query).all()
	.then((records) => {
		return Promise.all(
			records.map((r) => {
				// safeParseAsync in case of async refinements or transforms in schema, see https://zod.dev/?id=parseasync
				return recordWithSchema.safeParseAsync(r)
			})
		)
	})
}