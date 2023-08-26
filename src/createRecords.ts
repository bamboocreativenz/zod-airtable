import AirtableSDK from "airtable"

import { SchemaZodT } from "./types/schema"
import { SelectQueryParamsT } from "./types/queryParams"

export interface CreateRecords<T extends SchemaZodT> {
	tableId: string
	baseId: string
	schema: T
	query?: SelectQueryParamsT
	records: Array<T>
}

export interface CreateRecordsWithAirtable<T extends SchemaZodT>
	extends CreateRecords<T> {
	airtable: AirtableSDK
}
export interface CreateRecordsWithApiKey<T extends SchemaZodT>
	extends CreateRecords<T> {
	apiKey: string
}

//TODO should we change this to an upsert operation?
export function createRecords<T extends SchemaZodT>({
	tableId,
	schema,
	baseId,
	records,
	...otherArgs
}: CreateRecordsWithAirtable<T> | CreateRecordsWithApiKey<T>) {
	let airtable: AirtableSDK
	if ("airtable" in otherArgs) {
		airtable = otherArgs.airtable
	} else {
		airtable = new AirtableSDK({ apiKey: otherArgs.apiKey })
	}

	const parseddata = records.map((r) => schema.safeParse(r))

	const data = parseddata
		.flatMap((r) => (r.success === true ? r : []))
		.map((r) => r.data)

	const failedValidation = parseddata.flatMap((r) =>
		r.success === false ? r : []
	)

	let index = 0
	let batches = []
	for (index = 0; index < data.length; index += 10) {
		let chunk = data.slice(index, index + 10)
		batches.push(chunk)
	}

	return Promise.all(
		batches.map((batch) => {
			return airtable.base(baseId).table(tableId).create(batch)
		})
	).then((results) => {
		return {
			data: results,
			failedValidation,
		}
	})
}
