import { z } from "zod"
import axios from "axios"
import { FieldT } from "./types/fields.ts"
import { BaseZ, CreateBaseZ, ListBasesZ, TableZ } from "./types/base.ts"
import { baseIdZ } from "./types/airtableIds.ts"
import { writeFieldIdEnum } from "./utils/writeFieldIdEnum.ts"

export default class ZodAirTableMeta {
	private apiKey: string
	/**
	 * @constructor
	 * @param apiKey: Airtable Personal Access Token - https://airtable.com/create/tokens
	 */
	constructor(args: { apiKey: string }) {
		this.apiKey = args.apiKey
	}

	/**
	 * List bases
	 * @param offset - optional offset for paginated results
	 * @returns list of bases the API key can access in the order they appear on the user's home screen, 1000 bases at a time.
	 * If there is another page to request, pass the offset retrieved from the first request as a URL query parameter.
	 */
	public listBases = z
		.function()
		.args(z.string())
		.implement(async (offset) => {
			const url = offset
				? `https://api.airtable.com/v0/meta/bases?offset=${offset}`
				: `https://api.airtable.com/v0/meta/bases`
			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})
			return ListBasesZ.parse(res.data)
		})

	/**
	 * createBase - create a new base on Airtable
	 * @param CreateBaseZ object
	 * @returns BaseZ object
	 */
	public createBase = z
		.function()
		.args(CreateBaseZ)
		.implement(async (base) => {
			const url = `https://api.airtable.com/v0/meta/bases`
			const res = await axios.post(url, base, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
			})
			return BaseZ.parse(res.data)
		})

	/**
	 * getBaseSchema - get the schema of a base on Airtable
	 * @param baseIdZ string
	 * @returns Array of TableZ objects
	 */
	public getBaseSchema = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})
			return z.array(TableZ).parse(res.data)
		})

	/**
	 * You can also use it to generate enums on a cron job and source control them into a git repo
	 * Note the cron job should merge the existing enumObjects with the newly generated ones. That way
	 * it allows for field name changes over time.
	 */
	public generateBaseTSEnumObjects = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})

			// Parse the response so we have static types
			const tables = z.array(TableZ).parse(res.data)

			// Generate the enum as a Record
			return tables.map((table) => {
				return {
					tableName: table.name,
					fields: table.fields.reduce<Record<string, string>>((acc, field) => {
						acc[field.name] = field.id
						return acc
					}, {}),
				}
			})
		})

	/**
	 * generateTypescriptEnums is used to generate typescript fieldName -> fieldId enums from the Airtable Meta API
	 * It is useful during development to grab the latest schema and get an enum that can be used in development
	 */
	public generateBaseTSEnums = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			const tablesEnums = await this.generateBaseTSEnumObjects(baseId)

			// Generate the enums
			const enums = tablesEnums.map((table) => {
				return writeFieldIdEnum(table)
			})

			return enums
		})
}
