import { RecordT } from "../src/types/record"

const getRecordsMock: { records: Array<RecordT> } = {
	records: [
		{
			id: "rec123",
			fields: {
				Name: "Test Testerson"
			}
		},
		{
			id: "rec124",
			fields: {
				Name: "John Smith"
			}
		},
	]
}

export default {
  getRecordsMock 
}