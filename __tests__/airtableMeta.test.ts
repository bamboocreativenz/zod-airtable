import { isNativeError } from "util/types"
import { ZodAirTableMeta } from "../src"
import { env } from "../src/env"

describe("airtableMeta", () => {
	test("result Ok works as expected", async () => {
		const zair = new ZodAirTableMeta({ apiKey: env.AIRTABLE_API_KEY })

		const uut = await zair.listBases({})

		if (isNativeError(uut)) {
			throw uut
		} else if (!uut.success) {
			throw new Error(uut.error.message)
		} else {
			expect(uut.success).toBeTruthy()
			expect(uut.data).toHaveProperty("bases")
		}
	})
})
