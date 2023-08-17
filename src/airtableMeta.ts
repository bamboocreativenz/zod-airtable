import { z } from "zod"
import { Ok } from "ts-results-es"

import { BaseZ, CreateBaseZ, ListBasesZ, TableZ } from "./types/airtableBase.ts"
import { baseIdZ } from "./types/airtableIds.ts"
import {
	writeFieldIdEnum,
	writeTablesIdEnum,
} from "./utils/writeFieldIdEnum.ts"
import getError, { getIntegrationError } from "./utils/getError"
import { ErrorType, IntegrationErrorType } from "../errorTypes"

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
		.args(z.object({ offset: z.number().optional() }))
		.implement(async ({ offset }) => {
			try {
				// Fetch the data
				const url = offset
					? `https://api.airtable.com/v0/meta/bases?offset=${offset}`
					: `https://api.airtable.com/v0/meta/bases`
				const res = await fetch(url, {
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
					},
				})
				const response = await res.json()

				// Parse the results
				const result = ListBasesZ.safeParse(response)

				// Return wrapped in ts-results
				if (!result.success) {
					return getError(ErrorType.ValidationError, result.error)
				} else {
					return new Ok(result.data)
				}
			} catch (error) {
				return getIntegrationError(IntegrationErrorType.APIError, error)
			}
		})

	/**
	 * createBase - create a new base on Airtable
	 * @param CreateBaseZ object
	 * @returns BaseZ object
	 */
	public createBase = z
		.function()
		.args(CreateBaseZ)
		.implement(async (baseSchema) => {
			try {
				// Send the data
				const url = `https://api.airtable.com/v0/meta/bases`
				const res = await fetch(url, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(baseSchema),
				})
				const response = await res.json()

				// Parse the results
				const result = BaseZ.safeParse(response)

				// Return wrapped in ts-results
				if (!result.success) {
					return getError(ErrorType.ValidationError, result.error)
				} else {
					return new Ok(result.data)
				}
			} catch (error) {
				return getIntegrationError(IntegrationErrorType.APIError, error)
			}
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
			try {
				// Fetch the data
				const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
				const res = await fetch(url, {
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
					},
				})
				const response = await res.json()

				// Parse the result
				const result = z.array(TableZ).safeParse(response)

				// Return wrapped in ts-results
				if (!result.success) {
					return getError(ErrorType.ValidationError, result.error)
				} else {
					return new Ok(result.data)
				}
			} catch (error) {
				return getIntegrationError(IntegrationErrorType.APIError, error)
			}
		})

	public getTableNameIdObjects = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			try {
				// Fetch the data
				const response = await this.getNameIdObjects(baseId)

				if (!response.ok) {
					return response
				} else {
					// Reduce the data into a map of tableNames and tableIds
					const tableNameIds = response.val.reduce((acc, table) => {
						return {
							...acc,
							[table.tableName]: table.tableId,
						}
					}, {})

					// Parse the results
					const result = z.record(z.string()).safeParse(tableNameIds)

					// Return wrapped in ts-results
					if (!result.success) {
						return getError(ErrorType.ValidationError, result.error)
					} else {
						return new Ok(result.data)
					}
				}
			} catch (error) {
				return getIntegrationError(IntegrationErrorType.APIError, error)
			}
		})

	public getFieldNameIdObjects = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			// Fetch the data
			const result = await this.getNameIdObjects(baseId)

			if (!result.ok) {
				return result
			} else {
				// Flatten the tables into an array of fields
				const data = result.val.map((table) => table.fields)

				// Return wrapped in ts-results
				return new Ok(data)
			}
		})

	/**
	 * generateTypescriptEnums is used to generate typescript fieldName -> fieldId enums from the Airtable Meta API
	 * It is useful during development to grab the latest schema and get an enum that can be used in development
	 */
	public genFieldIdEnums = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			// Fetch the data
			const result = await this.getNameIdObjects(baseId)

			if (!result.ok) {
				return result
			} else {
				// Map the fields to an array of ts-enum strings
				const data = result.val.map((table) => {
					return writeFieldIdEnum(table)
				})

				// Return wrapped in ts-results
				return new Ok(data)
			}
		})

	public genTableIdEnums = z
		.function()
		.args(z.string(), baseIdZ)
		.implement(async (baseName, baseId) => {
			// Fetch the data
			const result = await this.getNameIdObjects(baseId)

			if (!result.ok) {
				return result
			} else {
				// Map the tables to an array of ts-enum strings
				const data = writeTablesIdEnum(baseName, result.val)

				// Return wrapped in ts-results
				return new Ok(data)
			}
		})

	/**
	 * generateBaseTSEnumObjects is used to create a simple intermediary data struture representing
	 * the Name -> Id duality for Tables and Fields in Airtable
	 * This enables you to track a data structure over time, eg setup a cron job and store the result in a hash table (firestore) or git repo
	 * Note the cron job should merge the existing enumObjects with the newly generated ones. That way
	 * it allows for field name changes over time.
	 * This is an internal function. Use the getTableNameIdObjects & getFieldNameIdObjects functions above instead.
	 */

	//TODO this currently only generates enums for the fields. We should have a function for the table ids as well - thats what we have actually used in AFRA.
	private getNameIdObjects = z
		.function()
		.args(baseIdZ)
		.implement(async (baseId) => {
			try {
				const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`
				const res = await fetch(url, {
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
					},
				})
				const response = await res.json()

				// Parse the response so we have static types
				const result = z.array(TableZ).safeParse(response)

				if (!result.success) {
					return getError(ErrorType.ValidationError, result.error)
				} else {
					// Generate the enum as a Record
					const data = result.data.map((table) => {
						return {
							tableName: table.name,
							tableId: table.id,
							fields: table.fields.reduce<Record<string, string>>(
								(acc, field) => {
									acc[field.name] = field.id
									return acc
								},
								{}
							),
						}
					})
					return new Ok(data)
				}
			} catch (error) {
				return getIntegrationError(IntegrationErrorType.APIError, error)
			}
		})
}
