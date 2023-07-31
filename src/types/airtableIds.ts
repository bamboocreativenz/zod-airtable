import { z } from "zod"

export const workspaceIdZ = z.string().min(12).max(20).startsWith("wsp")

export const baseIdZ = z.string().min(12).max(20).startsWith("app")

export const tableIdZ = z
	.string()
	.min(12)
	.max(20)
	.startsWith("tbl", "id must start with tbl")

export const viewIdZ = z
	.string()
	.min(12)
	.max(20)
	.startsWith("viw", "views must start with viw")

export const fieldIdZ = z
	.string()
	.min(12)
	.max(20)
	.startsWith("fld", "primaryFieldId must start with fld")
