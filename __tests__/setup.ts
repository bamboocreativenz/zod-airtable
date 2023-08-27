// see https://vitest.dev/guide/mocking.html#configuration

import { afterAll, afterEach, beforeAll } from "vitest"
import { setupServer } from "msw/node"
import { rest } from "msw"
import nodeFetch from "node-fetch"

import { BASE_ID, RECORD_ID_1, RECORD_ID_2, TABLE_ID } from "./constants"
import mocks from "./mocks"

export const restHandlers = [
	rest.get(
		`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
		(req, res, ctx) => {
			// return new Response(JSON.stringify(mocks.getRecordsMock), { status: 200 })
			return res(ctx.json(mocks.getRecordsMock))
		}
	),
	rest.get(
		`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${RECORD_ID_1}`,
		(req, res, ctx) => {
			// return new Response(JSON.stringify(mocks.getRecordsMock), { status: 200 })
			return res(ctx.json(mocks.getRcordsByIdFirstMock))
		}
	),
	rest.get(
		`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${RECORD_ID_2}`,
		(req, res, ctx) => {
			// return new Response(JSON.stringify(mocks.getRecordsMock), { status: 200 })
			return res(ctx.json(mocks.getRcordsByIdSecondMock))
		}
	),
]

const server = setupServer(...restHandlers)

// necessary as the airtable SDK uses node-fetch under the hood, we need to make sure msw is using the same fetch implementation
// @ts-ignore
global.fetch = nodeFetch

// Start server before all tests
beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" })
})

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
