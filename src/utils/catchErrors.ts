import { Err } from "ts-results-es"

import Sentry from "../../initSentryForAPI"

export default function catchErrors(err: unknown | Error | string) {
	// Dev logging
	if (process.env.NODE_ENV !== "production") {
		console.error({ err })
	}

	// Capture in Sentry
	Sentry.captureException(err)

	if (typeof err === "string") {
		//throw new Error(err)
		return new Err(err)
	} else if (err instanceof Error) {
		throw err
	} else {
		// throw new Error(JSON.stringify(err))
		return new Err(JSON.stringify(err))
	}
}
