import { z } from "zod"

export const TableZ = z.object({
	description: z.string().optional(),
	id: z.string().min(12).max(20).startsWith("tbl", "id must start with tbl"),
	name: z.string(),
	primaryFieldId: z
		.string()
		.min(12)
		.max(20)
		.startsWith("fld", "primaryFieldId must start with fld"),
	views: z.array(
		z.object({
			id: z
				.string()
				.min(12)
				.max(20)
				.startsWith("viw", "views must start with viw"),
			name: z.string(),
			type: z.enum([
				"grid",
				"form",
				"calendar",
				"gallery",
				"kanban",
				"timeline",
				"block",
			]),
		})
	),
	fields: z.array(
		z.object({
			description: z.string().optional(),
			id: z
				.string()
				.min(12)
				.max(20)
				.startsWith("fld", "fields must start with fld"),
			name: z.string(),
			type: z.enum([
				"singleLineText",
				"email",
				"url",
				"multilineText",
				"number",
				"percent",
				"currency",
				"singleSelect",
				"multipleSelects",
				"singleCollaborator",
				"multipleCollaborators",
				"multipleRecordLinks",
				"date",
				"dateTime",
				"phoneNumber",
				"multipleAttachments",
				"checkbox",
				"formula",
				"createdTime",
				"rollup",
				"count",
				"lookup",
				"multipleLookupValues",
				"autoNumber",
				"barcode",
				"rating",
				"richText",
				"duration",
				"lastModifiedTime",
				"button",
				"createdBy",
				"lastModifiedBy",
				"externalSyncSource",
			]),
			//TODO update options when its clearer what it contains.
			options: z.any().optional(),
		})
	),
})

export const BaseZ = z.object({
	tables: z.array(TableZ),
})

export const MetaFieldsZ = TableZ.shape.fields.element
export const ViewZ = TableZ.shape.views.element
