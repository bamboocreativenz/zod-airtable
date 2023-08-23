import { describe, expect, test } from "vitest"
import { z } from "zod"

import zodAirtable from "../src/airtable.ts"
import { getRecords } from "../src/getRecords.ts"

import { API_KEY, BASE_ID, TABLE_ID } from "./constants.ts"

import mocks from "./mocks.ts"

describe("zod-airtable", () => {
	test("can getRecords with direct usage", async () => {
		const expected = mocks.getRecordsMock.records.map(r => ({
			success: true,
			data: r
		}))

		const actual = await getRecords({
			apiKey: API_KEY,
			baseId: BASE_ID, 
			tableId: TABLE_ID,
			schema: z.object({
				Name: z.string(),
			})
		})

		expect(actual).toEqual(expected)
	})

	test("can getRecords with airtable singleton usage", async () => {
		const expected = mocks.getRecordsMock.records.map(r => ({
			success: true,
			data: r
		}))

		const singleton = zodAirtable({
			apiKey: API_KEY,
		})

		const actual = await singleton.getRecords({
			baseId: BASE_ID, 
			tableId: TABLE_ID,
			schema: z.object({
				Name: z.string(),
			})
		})

		expect(actual).toEqual(expected)
	})

	test("can getRecords with airtable singleton usage and default base provided", async () => {
		const expected = mocks.getRecordsMock.records.map(r => ({
			success: true,
			data: r
		}))

		const singleton = zodAirtable({
			apiKey: API_KEY,
			defaultBaseId: BASE_ID
		})

		// @ts-ignore: TODO fix type for when defaultBaseId is provided and thus baseId is not required	
		const actual = await singleton.getRecords({
			tableId: TABLE_ID,
			schema: z.object({
				Name: z.string(),
			})
		})

		expect(actual).toEqual(expected)
	})
})
