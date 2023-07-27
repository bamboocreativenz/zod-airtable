import { createEnv } from "@t3-oss/env-core"
import { ZodError, z } from "zod"

export const env = createEnv({
	server: {
		AIRTABLE_API_KEY: z.string(),
	},
	runtimeEnv: process.env,
	// Called when the schema validation fails.
	onValidationError: (error: ZodError) => {
		console.error(
			"❌ Invalid environment variables:",
			error.flatten().fieldErrors
		)
		throw new Error("Invalid environment variables")
	},
	// Called when server variables are accessed on the client.
	onInvalidAccess: (variable: string) => {
		throw new Error(
			"❌ Attempted to access a server-side environment variable on the client"
		)
	},
})
