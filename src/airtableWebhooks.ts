import { z } from "zod"
import axios from "axios"

export default class ZodAirTableWebhooks {
	private apiKey: string
	/**
	 * @constructor
	 * @param apiKey: Airtable Personal Access Token - https://airtable.com/create/tokens
	 */
	constructor(args: { apiKey: string }) {
		this.apiKey = args.apiKey
	}

	public listWebhooks = z
		.function()
		.args(z.string())
		.implement(async (offset) => {
			const url = "https://api.airtable.com/v0/bases/{baseId}/webhooks"
			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})
			return res.data
		})
}
