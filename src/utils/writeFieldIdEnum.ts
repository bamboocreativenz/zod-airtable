import { z } from "zod"

export const writeFieldIdEnum = z
	.function()
	.args(z.object({ tableName: z.string(), fields: z.record(z.string()) }))
	.implement((table) => {
		const start = `enum ${table.tableName} {\n`
		const enums = Object.entries(table.fields)
			.map(([key, value]) => `	${key} = "${value}"`)
			.join(",\n")
		const end = `\n}`
		return start + enums + end
	})
