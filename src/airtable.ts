import AirtableSDK, { FieldSet } from "airtable"
import { z } from "zod"
import { FieldT } from "./types/fields"
import { SelectQueryParamsT, zSelectQueryParams } from "./types/queryParams"

/**
 * apiKey: Airtable Personal Access Token - https://airtable.com/create/tokens
 * baseId: appId
 * tableId: table name or tableId
 * schema: zod schema for fields
 */
export default class Table<T extends z.ZodType<any, any, z.RecordType<string, FieldT>>> {
	private table: AirtableSDK.Table<FieldSet>
	private schema: T
	private listSchema: z.ZodArray<
		z.ZodObject<{ id: z.ZodString; createdTime: z.ZodString; fields: T }>
	>

	constructor(args: {
		apiKey: string
		baseId: string
		tableId: string
		schema: T
	}) {
		this.table = new AirtableSDK({ apiKey: args.apiKey })
			.base(args.baseId)
			.table(args.tableId)
		this.schema = args.schema
		this.listSchema = z.array(
			z.object({
				id: z.string(),
				createdTime: z.string(),
				fields: args.schema,
			})
		)
	}

	public async getAllRecords(query: SelectQueryParamsT = {}) {
		const data = await this.table
			.select(zSelectQueryParams.parse(query))
			.all()
			.then((records) => {
				return records.map((r) => {
					//TODO enrich with field names
					return r
				})
			})
			.catch((err) => {
				throw new Error(err)
			})
		const result = this.listSchema.safeParse(data)
		if (!result.success) {
			// TODO log error with sentry and generate slack notification
			// TODO Consider seperating out the failing records and returning 2 arrays. One of data that succeeded and one that didn't
			// TODO We should make the function capable of operating in different modes. eg filter out bad records, 2 array mode above, throw mode or return result
			throw new Error(result.error.message)
		} else {
			return result.data
		}
	}
}
