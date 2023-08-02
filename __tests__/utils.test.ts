import { writeFieldIdEnum } from "../src/utils/writeFieldIdEnum"

test("writeFieldIdEnum", () => {
	const uut = writeFieldIdEnum({
		tableName: "User",
		fields: { name: "fieldIdForName", age: "fieldIdForAge" },
	})

	expect(uut).toBe(
		`enum User {\n	name = "fieldIdForName",\n	age = "fieldIdForAge"\n}`
	)
})
