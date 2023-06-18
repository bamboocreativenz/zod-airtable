import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		AIRTABLE_API_KEY: z.string(),
	},
	runtimeEnv: {
		AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
	},
})
