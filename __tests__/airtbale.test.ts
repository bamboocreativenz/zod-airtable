import { z } from "zod"
import { ZodAirTable } from "../src"
import { env } from "../src/env.ts"

describe("Airtable", () => {
	test("can listRecords", async () => {
		const table = new ZodAirTable({
			apiKey: env.AIRTABLE_API_KEY,
			baseId: "appGjiqxJsDA2rAp4",
			tableId: "TestData",
			schema: z.object({ name: z.string() }),
		})

		const expected = [
			{ name: "Test Testerson", Notes: "a test user", Status: "Done" },
			{
				name: "John Smith",
				Notes: "a second test user",
				Status: "In progress",
			},
		]

		const uut = await table.getAllRecords()

		expect(uut.map((r) => r.fields)).toEqual(expected)
	})
})
