import { z } from "zod"

/** Airtable Fieldset
 * export interface FieldSet {
 * [key: string]: undefined | string | number | boolean | Collaborator |
 * ReadonlyArray<Collaborator> | ReadonlyArray<string> | ReadonlyArray<Attachment>;
 * }
 */

export const CollaboratorZ = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
})
export type CollaboratorT = z.infer<typeof CollaboratorZ>

export const ThumbnailZ = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number(),
})
export type ThumbnailT = z.infer<typeof ThumbnailZ>

export const AttatchementZ = z.object({
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
export type AttatchementT = z.infer<typeof AttatchementZ>

export const FieldZ = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	CollaboratorZ,
	z.array(CollaboratorZ),
	z.array(z.string()),
	z.array(AttatchementZ),
])
export type FieldT = z.infer<typeof FieldZ>

export const FieldSetZ = z.record(FieldZ)
export type FieldSetT = z.infer<typeof FieldSetZ>