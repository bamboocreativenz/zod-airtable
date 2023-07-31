import { z } from "zod"
import {
	baseIdZ,
	fieldIdZ,
	tableIdZ,
	viewIdZ,
	workspaceIdZ,
} from "./airtableIds"

export const ViewZ = z.object({
	id: viewIdZ,
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

export const TableZ = z.object({
	description: z.string().optional(),
	id: tableIdZ,
	name: z.string(),
	primaryFieldId: fieldIdZ,
	views: z.array(ViewZ).optional(),
	fields: z.array(
		z.object({
			description: z.string().optional(),
			id: fieldIdZ,
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

export const ListBasesZ = z.object({
	bases: z.array(
		z.object({
			id: baseIdZ,
			name: z.string(),
			permissionLevel: z.enum(["none", "read", "comment", "edit", "create"]),
		})
	),
	offset: z.string().optional(),
})

export const BaseZ = z.object({
	tables: z.array(TableZ),
})

export const CreateBaseZ = z.object({
	name: z.string(),
	workspaceId: workspaceIdZ,
	tables: z.array(TableZ.omit({ id: true, primaryFieldId: true })),
})

export const MetaFieldsZ = TableZ.shape.fields.element
