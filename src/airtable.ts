import AirtableSDK, { FieldSet } from "airtable"
import { z } from "zod"

/** Airtable Fieldset
 * export interface FieldSet {
 * [key: string]: undefined | string | number | boolean | Collaborator |
 * ReadonlyArray<Collaborator> | ReadonlyArray<string> | ReadonlyArray<Attachment>;
 * }
 */

const CollaboratorZ = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
})

const ThumbnailZ = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number(),
})

const AttatchementZ = z.object({
	id: z.string(),
	url: z.string().url(),
	filename: z.string(),
	size: z.number(),
	// TODO update type to be enum of allowed blob types
	type: z.string(),
	thumbnails: z.object({
		small: ThumbnailZ,
		large: ThumbnailZ,
		full: ThumbnailZ,
	}),
})

const FieldZ = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	CollaboratorZ,
	z.array(CollaboratorZ),
	z.array(z.string()),
	z.array(AttatchementZ),
])
export const FieldSetZ = z.record(FieldZ)

type CollaboratorT = {
	id: string
	email: string
	name: string
}

type ThumbnailT = {
	url: string
	width: string
	height: string
}

type AttatchmentT = Array<{
	id: string
	url: string
	filename: string
	size: number
	type: string
	thumbnails: {
		small: ThumbnailT
		large: ThumbnailT
		full: ThumbnailT
	}
}>

type FieldT =
	| undefined
	| string
	| number
	| boolean
	| Array<string>
	| Array<{
			id: string
			email: string
			name: string
	  }>
	| AttatchmentT
	| CollaboratorT
	| Array<CollaboratorT>

export default class Table<T extends z.ZodType<any, any, z.RecordType<string, FieldT>>> {
	private table: AirtableSDK.Table<FieldSet>
	private schema: T
	private listSchema: z.ZodArray<
			z.ZodObject<{ id: z.ZodString; createdTime: z.ZodString; fields: T }>
		>

	constructor(apiKey: string, baseName: string, tableName: string, schema: T) {
		this.table = new AirtableSDK({ apiKey }).base(baseName).table(tableName)
		this.schema = schema
		this.listSchema = z.array(z.object({
				id: z.string(),
				createdTime: z.string(),
				fields: schema
			})
	}

	public async listRecords() {
		const data = await this.table
			.select()
			.all()
			.catch((err) => {
				throw new Error(err)
			})
		return this.listSchema.parse(data)
	}
}
