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

export interface GetRecordsWithIds<T extends SchemaZodT> {
	tableId: string
	baseId: string
	schema: T
	recordIds: string[]
}

export interface GetRecordsWithQuery<T extends SchemaZodT> {
	tableId: string
	baseId: string
	schema: T
	query?: SelectQueryParamsT
}

export interface GetRecordsWithIdsAndAirtable<T extends SchemaZodT>
	extends GetRecordsWithIds<T> {
	airtable: AirtableSDK
}

export interface GetRecordsWithQueryAndAirtable<T extends SchemaZodT>
	extends GetRecordsWithQuery<T> {
	airtable: AirtableSDK
}
export interface GetRecordsWithIdsAndApiKey<T extends SchemaZodT>
	extends GetRecordsWithIds<T> {
	apiKey: string
}

export interface GetRecordsWithQueryAndApiKey<T extends SchemaZodT>
	extends GetRecordsWithQuery<T> {
	apiKey: string
}

//TODO Add jsdoc as the types are not clear
export function getRecords<T extends SchemaZodT>({
	tableId,
	baseId,
	schema,
	...otherArgs
}:
	| GetRecordsWithIdsAndAirtable<T>
	| GetRecordsWithQueryAndAirtable<T>
	| GetRecordsWithIdsAndApiKey<T>
	| GetRecordsWithQueryAndApiKey<T>) {
	let airtable: AirtableSDK
	if ("airtable" in otherArgs) {
		airtable = otherArgs.airtable
	} else {
		airtable = new AirtableSDK({ apiKey: otherArgs.apiKey })
	}

	// we overwrite the base RecordZ fields with the specific schema provided
	const recordWithSchema = RecordZ.extend({
		fields: schema,
	})

	if ("recordIds" in otherArgs) {
		return Promise.all(
			otherArgs.recordIds.map((id) => {
				return airtable
					.base(baseId)
					.table(tableId)
					.find(id)
					.then((record) => {
						// safeParseAsync in case of async refinements or transforms in schema, see https://zod.dev/?id=parseasync
						return recordWithSchema.safeParseAsync(record)
					})
			})
		)
	} else {
		return airtable
			.base(baseId)
			.table(tableId)
			.select(otherArgs.query)
			.all()
			.then((records) => {
				return Promise.all(
					records.map((r) => {
						return recordWithSchema.safeParseAsync(r)
					})
				)
			})
	}
}
