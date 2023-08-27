import { z } from "zod"

import { SchemaZ } from "./schema"

// N.B. this is not a complete Airtable record passed back from the API, but for now these are the fields relevant to our module.
export const RecordZ = z.object({
	id: z.string(),
	fields: SchemaZ 
})
export type RecordT = z.infer<typeof RecordZ>