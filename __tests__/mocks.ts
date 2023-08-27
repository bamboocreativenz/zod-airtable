import { RecordT } from "../src/types/record"
import { RECORD_ID_1, RECORD_ID_2 } from "./constants"

const getRcordsByIdFirstMock: RecordT = {
	id: RECORD_ID_1,
	fields: {
		Name: "Test Testerson",
	},
}

const getRcordsByIdSecondMock: RecordT = {
	id: RECORD_ID_2,
	fields: {
		Name: "Test Testerson",
	},
}

const getRecordsMock: { records: Array<RecordT> } = {
	records: [getRcordsByIdFirstMock, getRcordsByIdSecondMock],
}

export default {
	getRcordsByIdFirstMock,
	getRcordsByIdSecondMock,
	getRecordsMock,
}
