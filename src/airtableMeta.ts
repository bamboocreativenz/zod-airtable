import { z } from "zod"
import axios from "axios"
import { FieldT } from "./types/fields.ts"
import { BaseZ, CreateBaseZ, ListBasesZ, TableZ } from "./types/base.ts"
import { baseIdZ } from "./types/airtableIds.ts"
import {
	writeFieldIdEnum,
	writeTablesIdEnum,
} from "./utils/writeFieldIdEnum.ts"

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
		.returns(z.promise(ListBasesZ))
		.implement(async (offset) => {
			const url = offset
				? `https://api.airtable.com/v0/meta/bases?offset=${offset}`
				: `https://api.airtable.com/v0/meta/bases`
			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})
			return res.data
		})

	/**
	 * createBase - create a new base on Airtable
	 * @param CreateBaseZ object
	 * @returns BaseZ object
	 */
	public createBase = z
		.function()
		.args(CreateBaseZ)
		.returns(z.promise(BaseZ))
		.implement(async (base) => {
			const url = `https://api.airtable.com/v0/meta/bases`
			const res = await axios.post(url, base, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
			})
			return res.data
		})

	/**
	 * getBaseSchema - get the schema of a base on Airtable
	 * @param baseIdZ string
	 * @returns Array of TableZ objects
	 */
	public getBaseSchema = z
		.function()
		.args(baseIdZ)
		.returns(z.promise(z.array(TableZ)))
		.implement(async (baseId) => {
			const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})
			return res.data
		})

	/**
	 * generateBaseTSEnumObjects is used to create a simple intermediary data struture representing
	 * the Name -> Id duality for Tables and Fields in Airtable
	 * This enables you to track a data structure over time, eg setup a cron job and store the result in a hash table (firestore) or git repo
	 * Note the cron job should merge the existing enumObjects with the newly generated ones. That way
	 * it allows for field name changes over time.
	 * This is an internal function. Use the getTableNameIdObjects & getFieldNameIdObjects functions below instead.
	 */

	//TODO this currently only generates enums for the fields. We should have a function for the table ids as well - thats what we have actually used in AFRA.
	private getNameIdObjects = z
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
					tableId: table.id,
					fields: table.fields.reduce<Record<string, string>>((acc, field) => {
						acc[field.name] = field.id
						return acc
					}, {}),
				}
			})
		})

	public getTableNameIdObjects = z
		.function()
		.args(baseIdZ)
		.returns(z.promise(z.record(z.string())))
		.implement(async (baseId) => {
			const tables = await this.getNameIdObjects(baseId)

			return tables.reduce((acc, table) => {
				return {
					...acc,
					[table.tableName]: table.tableId,
				}
			}, {})
		})

	public getFieldNameIdObjects = z
		.function()
		.args(baseIdZ)
		.returns(z.promise(z.array(z.record(z.string()))))
		.implement(async (baseId) => {
			const tables = await this.getNameIdObjects(baseId)

			return tables.map((table) => table.fields)
		})

	/**
	 * generateTypescriptEnums is used to generate typescript fieldName -> fieldId enums from the Airtable Meta API
	 * It is useful during development to grab the latest schema and get an enum that can be used in development
	 */
	public genFieldIdEnums = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			const tablesEnums = await this.getNameIdObjects(baseId)

			// Generate the field Enums per Table
			return tablesEnums.map((table) => {
				return writeFieldIdEnum(table)
			})
		})

	public genTableIdEnums = z
		.function()
		.args(z.string(), baseIdZ)
		.implement(async (baseName, baseId) => {
			const tablesEnums = await this.getNameIdObjects(baseId)
			// Generate the Table Enum
			return writeTablesIdEnum(baseName, tablesEnums)
		})
}
