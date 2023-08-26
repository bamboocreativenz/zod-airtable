import { z } from "zod"

const renameObjectProps = z
	.function()
	.args(z.object({ data: z.record(z.any()), map: z.record(z.string()) }))
	.implement(({ data, map }) => {
		return Object.keys(data).reduce((acc, key) => {
			if (map.hasOwnProperty(key)) {
				acc[map[key]] = data[key]
				return acc
			}
			acc[key] = data[key]
			return acc
		}, {} as Record<string, any>)
	})

export default renameObjectProps
