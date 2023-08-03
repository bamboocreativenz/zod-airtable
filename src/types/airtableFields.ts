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

export const FieldZ = z.union([
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

type AttatchmentT = {
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
}

export type FieldT =
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
	| Array<AttatchmentT>
	| CollaboratorT
	| Array<CollaboratorT>
