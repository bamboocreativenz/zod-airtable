import { z } from "zod"

import { FieldZ } from "./airtableFields"

export const SchemaZ = z.record(FieldZ)
// N.B. this is a type for a zod
export type SchemaZodT = z.ZodType<z.infer<typeof SchemaZ>>