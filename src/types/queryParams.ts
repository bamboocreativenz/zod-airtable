import { z } from "zod"

export const SelectQueryParamsZ = z
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

/**
 * @param fields Array of field names or fieldIds.
 * @param filterByFormula Airtable formula to filter by. Recommended to test in Airtable first.
 * @param maxRecords Number of records to return.
 * @param pageSize Number of records to return per page.
 * @param sort Field names/Ids to sort by and the direction to sort in.
 * @param view The table view to filter by.
 * @param cellFormat The cell format to return
 * @param timeZone The time zone to use for date fields.
 * @param userLocale The user locale to use
 * @param returnFieldsByFieldId Whether to return fields by name or by fieldId.
 */
export type SelectQueryParamsT = z.infer<typeof SelectQueryParamsZ>
