import { describe, expect, test } from "vitest"
import { z } from "zod"

import zodAirtable from "../src/airtable.ts"
import { getRecords } from "../src/getRecords.ts"

import {
	API_KEY,
	BASE_ID,
	TABLE_ID,
	RECORD_ID_1,
	RECORD_ID_2,
} from "./constants.ts"

import mocks from "./mocks.ts"

describe("zod-airtable", () => {
	test("can getRecords with direct usage", async () => {
		const expected = mocks.getRecordsMock.records.map((r) => ({
			success: true,
			data: r,
		}))

		const actual = await getRecords({
			airtable: API_KEY,
			baseId: BASE_ID,
			tableId: TABLE_ID,
			schema: z.object({
				Name: z.string(),
			}),
		})

		expect(actual).toEqual(expected)
	})

	test("can getRecords with airtable singleton usage", async () => {
		const expected = mocks.getRecordsMock.records.map((r) => ({
			success: true,
			data: r,
		}))

		const singleton = zodAirtable({
			apiKey: API_KEY,
			defaultBaseId: BASE_ID,
			defaultTableId: TABLE_ID,
			defaultSchema: z.object({
				Name: z.string(),
			}),
		})

		const actual = await singleton.getRecords()

		expect(actual).toEqual(expected)
	})

	test("can getRecordsByIds with airtable singleton usage", async () => {
		const expected = mocks.getRecordsMock.records.map((r) => ({
			success: true,
			data: r,
		}))

		const singleton = zodAirtable({
			apiKey: API_KEY,
			defaultBaseId: BASE_ID,
			defaultTableId: TABLE_ID,
			defaultSchema: z.object({
				Name: z.string(),
			}),
		})

		const actual = await singleton.getRecordsById({
			recordIds: [RECORD_ID_1, RECORD_ID_2],
		})

		expect(actual).toEqual(expected)
	})
})
