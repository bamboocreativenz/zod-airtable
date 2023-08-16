import { z } from "zod"

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
			const res = await fetch(url, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			})
			//TODO add zod validation
			return await res.json()
		})
}
