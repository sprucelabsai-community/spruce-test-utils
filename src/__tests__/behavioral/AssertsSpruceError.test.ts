import AbstractSpruceError, { ISpruceErrorOptions } from '@sprucelabs/error'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import errorAssertUtil from '../../utilities/errorAssert.utility'

interface ErrorOne extends ISpruceErrorOptions {
	code: 'ERROR_ONE'
	booleanParam: boolean
}

interface ErrorTwo extends ISpruceErrorOptions {
	code: 'ERROR_TWO'
	textParam: string
}

type ErrorOptions = ErrorOne | ErrorTwo

class TestError extends AbstractSpruceError<ErrorOptions> {}

export default class AssertsSpruceErrorTest extends AbstractSpruceTest {
	@test()
	protected static async failsWhenErrorCodeDoesNotMatch() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		assert.doesThrow(
			() => errorAssertUtil.assertError(err, 'ERROR_THREE'),
			/Invalid error code. Expected ERROR_THREE but got ERROR_ONE/gi
		)
	}

	@test()
	protected static async failsWhenCodeMatchesButOptionsDoNotMatch() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		assert.doesThrow(
			() => errorAssertUtil.assertError(err, 'ERROR_ONE', { hello: 'world' }),
			/hello(.*?)was not found in/gis
		)
	}

	@test()
	protected static async passesWhenCodeMatches() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		errorAssertUtil.assertError(err, 'ERROR_ONE')
	}

	@test()
	protected static async passesWhenCodeAndPayloadMatches() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		errorAssertUtil.assertError(err, 'ERROR_ONE', { booleanParam: true })
	}

	@test(
		'can strip friendly message from options top level',
		{ code: 'TEST', friendlyMessage: 'go away' },
		{ code: 'TEST' }
	)
	@test(
		'can strip friendly message from options at one level',
		{ results: { code: 'TEST', friendlyMessage: 'go away' } },
		{ results: { code: 'TEST' } }
	)
	@test(
		'can strip friendly message from options at one level in array',
		{ results: [{ code: 'TEST', friendlyMessage: 'go away' }] },
		{ results: [{ code: 'TEST' }] }
	)
	@test(
		'can strip friendly message from options at two levels',
		{ results: { errors: [{ code: 'TEST', friendlyMessage: 'go away' }] } },
		{ results: { errors: [{ code: 'TEST' }] } }
	)
	protected static strippingFriendlyMessage(options: any, expected: any) {
		const actual = errorAssertUtil.stripFriendlyMessageFromOptions(options)
		assert.isEqualDeep(actual, expected)
	}

	@test()
	protected static strippingFriendlyMessageConvertsSpruceErrorToOptions() {
		const actual = errorAssertUtil.stripFriendlyMessageFromOptions({
			fun: {
				times: [
					new TestError({ code: 'ERROR_ONE', booleanParam: true }),
					new TestError({ code: 'ERROR_TWO', textParam: 'text' }),
				],
			},
		})

		assert.isEqualDeep(actual, {
			fun: {
				times: [
					{
						code: 'ERROR_ONE',
						booleanParam: true,
					},
					{
						code: 'ERROR_TWO',
						textParam: 'text',
					},
				],
			},
		})
	}
}
