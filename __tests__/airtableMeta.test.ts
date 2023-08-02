import { ZodAirTableMeta } from "../src"
import { env } from "../src/env"

describe("airtableMeta", () => {
	test("result Ok works as expected", async () => {
		const zair = new ZodAirTableMeta({ apiKey: env.AIRTABLE_API_KEY })

		const uut = await zair.listBases({})

		expect(uut.ok).toBeTruthy()
		if (uut.ok) {
			expect(uut.val).toHaveProperty("bases")
		}
	})
})
