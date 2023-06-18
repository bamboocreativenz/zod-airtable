import { z } from "zod"
import { Table } from "../src"
import { env } from "../src/env.mjs"

describe("Airtable", () => {
	test("can listRecords", () => {
		const table = new Table(
			env.AIRTABLE_API_KEY,
			"appGjiqxJsDA2rAp4",
			"TestData",
			z.object({ name: z.string() })
		)

		const expected = [
			{ "Full Name": "Test Testerson", Notes: "a test user", Status: "Done" },
			{
				"Full Name": "John Smith",
				Notes: "a second test user",
				Status: "In progress",
			},
		]

		return table
			.listRecords()
			.then((records) => expect(records.map((r) => r.fields)).toEqual(expected))
	})
})
