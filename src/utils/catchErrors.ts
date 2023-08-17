import { Err } from "ts-results-es"
import { ErrorType } from "../../errorTypes"

export default function catchErrors(
	errorType: ErrorType,
	error: unknown | Error | string
) {
	// Dev logging
	if (process.env.NODE_ENV !== "production") {
		console.error({ error })
	}

	if (typeof error === "string") {
		return new Err({ errorType, error })
	} else if (error instanceof Error) {
		return new Err({ errorType, error: error.message })
	} else {
		return new Err({ errorType, error: JSON.stringify(error) })
	}
}
