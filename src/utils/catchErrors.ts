import { Err } from "ts-results-es"

export default function catchErrors(err: unknown | Error | string) {
	// Dev logging
	if (process.env.NODE_ENV !== "production") {
		console.error({ err })
	}

	if (typeof err === "string") {
		return new Err(err)
	} else if (err instanceof Error) {
		return new Err(err)
	} else {
		return new Err(new Error(JSON.stringify(err)))
	}
}
