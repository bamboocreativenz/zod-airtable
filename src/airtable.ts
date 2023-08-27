// if the user wants a singleton to only have to get the api key once etc, then this returns curried functions
// can also provide a default base id that is passed to all functions if a specific baseId is not provided

import AirtableSDK from "airtable"

import { getRecords } from "./getRecords"
import { SchemaZodT } from "./types/schema"
import { SelectQueryParamsT } from "./types/queryParams"
import { getRecordsById } from "./getRecordsById"

interface ZodAirtable<T extends SchemaZodT> {
	apiKey: string
	defaultBaseId: string
	defaultTableId: string
	defaultSchema: T
}

export default function zodAirtable<T extends SchemaZodT>({
	apiKey,
	defaultBaseId,
	defaultTableId,
	defaultSchema,
}: ZodAirtable<T>) {
	const airtable = new AirtableSDK({ apiKey })

	return {
		getRecords: (args?: { query: SelectQueryParamsT }) =>
			getRecords({
				airtable,
				tableId: defaultTableId,
				schema: defaultSchema,
				baseId: defaultBaseId,
				query: args?.query,
			}),
		getRecordsById: ({ recordIds }: { recordIds: Array<string> }) =>
			getRecordsById({
				airtable,
				tableId: defaultTableId,
				schema: defaultSchema,
				baseId: defaultBaseId,
				recordIds,
			}),
	}
}
