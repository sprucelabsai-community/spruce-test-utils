import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import generateId from '../../utilities/generateId.utility'

export default class GeneratesRandomIdTest extends AbstractSpruceTest {
	@test()
	protected static canGenerateId() {
		assert.isFunction(generateId)
	}

	@test()
	protected static returnsAStingGreaterThan20CharsAndLessThan41() {
		const length = generateId().length
		assert.isAbove(length, 19)
		assert.isBelow(length, 41)
	}

	@test()
	protected static returnsUniqueValue() {
		const id1 = generateId()
		const id2 = generateId()
		assert.isNotEqual(id1, id2)
	}

	@test()
	protected static async returnValuesAreUnique() {
		const generateIds = []
		for (let i = 0; i <= 50; i++) {
			generateIds.push(
				new Promise((resolve, _) => {
					resolve(generateId())
				})
			)
		}
		const ids = await Promise.all(generateIds)
		const results = ids.filter((r, idx) => ids.indexOf(r) !== idx)
		assert.isLength(results, 0)
	}

	@test()
	protected static returnedValueOnlyHasAlphaNum() {
		const id = generateId()
		const matches = id.match(/^[0-9A-Za-z]+$/)

		assert.isTruthy(matches)
	}
}
