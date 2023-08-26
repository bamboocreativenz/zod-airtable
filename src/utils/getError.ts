import { Err } from "ts-results-es"
import { ErrorType, IntegrationErrorType } from "../../errorTypes"
import { z } from "zod"

export default function getError(
	errorType: ErrorType,
	error: unknown | Error | string | z.ZodError
) {
	if (error instanceof z.ZodError) {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error: error.message, issues: error.issues })
		}

		return new Err({ errorType, error: error.message })
	} else if (typeof error === "string") {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error })
		}

		return new Err({ errorType, error })
	} else if (error instanceof Error) {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error: error.message })
		}

		return new Err({ errorType, error: error.message })
	} else {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error: JSON.stringify(error) })
		}

		return new Err({ errorType, error: JSON.stringify(error) })
	}
}

export function getIntegrationError(
	errorType: IntegrationErrorType,
	error: unknown | Error | string
) {
	if (typeof error === "string") {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error })
		}

		return new Err({ errorType, error })
	} else if (error instanceof Error) {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error: error.message })
		}

		return new Err({ errorType, error: error.message })
	} else {
		if (process.env.NODE_ENV !== "production") {
			console.error({ error: JSON.stringify(error) })
		}

		return new Err({ errorType, error: JSON.stringify(error) })
	}
}
