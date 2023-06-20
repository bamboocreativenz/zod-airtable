import { z } from "zod"

export const zSelectQueryParams = z
	.object({
		fields: z.array(z.string()),
		filterByFormula: z.string(),
		maxRecords: z.number(),
		pageSize: z.number(),
		sort: z.array(
			z.object({ field: z.string(), direction: z.enum(["asc", "desc"]) })
		),
		view: z.string(),
		cellFormat: z.enum(["json", "string"]),
		timeZone: z.string(),
		userLocale: z.string(),
		returnFieldsByFieldId: z.boolean(),
	})
	.partial()

export type SelectQueryParamsT = z.infer<typeof zSelectQueryParams>
