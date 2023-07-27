import { z } from "zod"
import { Table } from "../src"
import { env } from "../src/env.ts"

describe("Airtable", () => {
	test("can listRecords", () => {
		const table = new Table({
			apiKey: env.AIRTABLE_API_KEY,
			baseId: "appGjiqxJsDA2rAp4",
			tableId: "TestData",
			schema: z.object({ name: z.string() }),
		})

		const expected = [
			{ "Full Name": "Test Testerson", Notes: "a test user", Status: "Done" },
			{
				"Full Name": "John Smith",
				Notes: "a second test user",
				Status: "In progress",
			},
		]

		return table
			.getAllRecords()
			.then((records) => expect(records.map((r) => r.fields)).toEqual(expected))
	})
})
