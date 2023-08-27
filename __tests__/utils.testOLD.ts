import {
	writeFieldIdEnum,
	writeTablesIdEnum,
} from "../src/utils/writeFieldIdEnum"

test("writeFieldIdEnum", () => {
	const uut = writeFieldIdEnum({
		tableName: "User",
		tableId: "tableIdForUser",
		fields: { name: "fieldIdForName", age: "fieldIdForAge" },
	})

	expect(uut).toBe(
		`enum User {\n	name = "fieldIdForName",\n	age = "fieldIdForAge"\n}`
	)
})

test("writeTablesIdEnum", () => {
	const uut = writeTablesIdEnum("Bamboo Merchandise", [
		{
			tableName: "User",
			tableId: "tableIdForUser",
			fields: { name: "fieldIdForName", age: "fieldIdForAge" },
		},
		{
			tableName: "Products",
			tableId: "tableIdForProducts",
			fields: { name: "fieldIdForName", type: "fieldIdForType" },
		},
	])

	expect(uut).toBe(
		`enum Bamboo Merchandise {\n	User = "tableIdForUser",\n	Products = "tableIdForProducts"\n}`
	)
})
