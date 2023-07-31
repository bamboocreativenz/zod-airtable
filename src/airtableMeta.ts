import { z } from "zod"
import axios from "axios"
import { FieldT } from "./types/fields.ts"
import { CreateBaseZ, ListBasesZ } from "./types/base.ts"
import { baseIdZ } from "./types/airtableIds.ts"

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
	 * @returns list of bases the API key can access in the order they appear on the user's home screen, 1000 bases at a time.
	 * If there is another page to request, pass the offset as a URL query parameter.
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
			return res.data
		})

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
			return res.data
		})
}
