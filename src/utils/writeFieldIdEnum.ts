import { z } from "zod"

const enumObjectZ = z.object({
	tableName: z.string(),
	tableId: z.string(),
	fields: z.record(z.string()),
})

export const writeFieldIdEnum = z
	.function()
	.args(enumObjectZ)
	.implement((table) => {
		const start = `enum ${table.tableName} {\n`
		const enums = Object.entries(table.fields)
			.map(([key, value]) => `	${key} = "${value}"`)
			.join(",\n")
		const end = `\n}`
		return start + enums + end
	})

export const writeTablesIdEnum = z
	.function()
	.args(z.string(), z.array(enumObjectZ))
	.implement((baseName, tables) => {
		const start = `enum ${baseName} {\n`
		const enums = tables
			.map((table) => `	${table.tableName} = "${table.tableId}"`)
			.join(",\n")
		const end = `\n}`
		return start + enums + end
	})
