// if the user wants a singleton to only have to get the api key once etc, then this returns curried functions
// can also provide a default base id that is passed to all functions if a specific baseId is not provided

import AirtableSDK from "airtable"

import { getRecords, GetRecordsWithAirtable } from "./getRecords"
import { SchemaZodT } from "./types/schema"

interface ZodAirtable {
	apiKey: string
	defaultBaseId?: string
}

export default function zodAirtable ({
	apiKey,
	defaultBaseId
}: ZodAirtable) {
	const airtable = new AirtableSDK({ apiKey })

	// TODO: auto-curry in TS?
	if (!defaultBaseId) {
		return {
			getRecords: <T extends SchemaZodT>({
				tableId,
				schema,
				baseId,
				query
			}: Omit<GetRecordsWithAirtable<T>, 'airtable'>) => getRecords({
				airtable,
				tableId,
				schema,
				baseId,
				query
			})
		}
	} else {
		return {
			getRecords: <T extends SchemaZodT>({
				tableId,
				schema,
				baseId,
				query
			}: Omit<GetRecordsWithAirtable<T>, 'airtable' | 'baseId'> & { baseId?: string }) => getRecords({
				airtable,
				tableId,
				schema,
				baseId: baseId || defaultBaseId,
				query
			})
		}
	}
}
