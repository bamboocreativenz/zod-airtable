import AirtableSDK, { FieldSet } from "airtable"
import { z } from "zod"
import { SelectQueryParamsZ } from "./types/queryParams"
import { FieldT } from "./types/airtableFields"
import { Err, Ok } from "ts-results-es"
import getError from "./utils/getError"
import { ErrorType } from "../errorTypes"
import renameObjectProps from "./utils/renameObjectProperties"

/**
 * @class ZodAirTable
 */
export default class ZodAirTable<
	T extends z.ZodType<any, any, z.RecordType<string, FieldT>>
> {
	private table: AirtableSDK.Table<FieldSet>
	private schema: T
	private airtableSchema: z.ZodObject<{
		id: z.ZodString
		createdTime: z.ZodString
		fields: T
	}>
	private listSchema: z.ZodArray<
		z.ZodObject<{ id: z.ZodString; createdTime: z.ZodString; fields: T }>
	>
	/**
	 * @constructor
	 * @param apiKey: Airtable Personal Access Token - https://airtable.com/create/tokens
	 * @param baseId: Airtable base/appId
	 * @param tableId: Table name or tableId
	 * @param schema: zod object({}) schema for fields
	 */
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
		this.airtableSchema = z.object({
			id: z.string(),
			createdTime: z.string(),
			fields: args.schema,
		})
		this.listSchema = z.array(
			z.object({
				id: z.string(),
				createdTime: z.string(),
				fields: args.schema,
			})
		)
	}

	/**
	 * @function getAllRecords returns all records in the table
	 * @param query Optional query params inculding filterByFormula, maxRecords, etc
	 * @param fieldIdMap is an hash map of field names and ids that can be used when
	 * @returns Array of result wrapped records, both valid and not
	 */
	public listAllRecords = z
		.function()
		.args(
			z.object({
				query: SelectQueryParamsZ.optional(),
				fieldIdMap: z.record(z.string()).optional(),
			})
		)
		.implement(async ({ query, fieldIdMap }) => {
			const response = await this.table
				.select(query)
				.all()
				.then((records) => {
					// DL: DX question here, would it be nicer if we had the returnFieldsByFieldId as a class property that we inject into the query?
					if (
						fieldIdMap != undefined &&
						query?.returnFieldsByFieldId === true
					) {
						return new Ok(
							records.map((record) => {
								return {
									...record,
									fields: renameObjectProps({
										data: record.fields,
										map: fieldIdMap,
									}),
								}
							})
						)
					}
					return new Ok(records)
				})
				.catch((err) => {
					return getError(ErrorType.APIError, err)
				})

			if (!response.ok) {
				return response
			} else {
				return new Ok(await Promise.all(
					response.val.map(async (r) => {
						const parsed = this.airtableSchema.safeParse(r)
						if (!parsed.success) {
							return getError(ErrorType.ValidationError, parsed.error)
						}
						return new Ok(parsed.data)
					})
				)
			}
		})
}
