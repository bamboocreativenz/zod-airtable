export default function catchErrors(err: unknown | Error | string) {
	// Dev logging
	if (process.env.NODE_ENV !== "production") {
		console.error({ err })
	}

	if (typeof err === "string") {
		return new Error(err)
	} else if (err instanceof Error) {
		throw err
	} else {
		return new Error(JSON.stringify(err))
	}
}
