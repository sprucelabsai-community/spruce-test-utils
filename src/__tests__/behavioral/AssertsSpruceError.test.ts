import AbstractSpruceError, { ISpruceErrorOptions } from '@sprucelabs/error'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import errorAssertUtil from '../../utilities/errorAssert.utility'

interface ErrorOne extends ISpruceErrorOptions {
	code: 'ERROR_ONE',
	booleanParam: boolean
}

interface ErrorTwo extends ISpruceErrorOptions {
	code: 'ERROR_TWO',
	textParam: string
}

type ErrorOptions = ErrorOne | ErrorTwo


class TestError extends AbstractSpruceError<ErrorOptions> {}

export default class AssertsSpruceErrorTest extends AbstractSpruceTest {

	@test()
	protected static async failsWhenErrorCodeDoesNotMatch() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		assert.doesThrow(() => errorAssertUtil.assertError(err,'ERROR_THREE'),/Invalid error code. Expected ERROR_THREE but got ERROR_ONE/ig)
		
	}
	
	@test()
	protected static async failsWhenCodeMatchesButOptionsDoNotMatch() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		assert.doesThrow(() => errorAssertUtil.assertError(err,'ERROR_ONE', {hello: 'world'}),/hello(.*?)was not found in/igs)
	}

	@test()
	protected static async passesWhenCodeMatches() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		errorAssertUtil.assertError(err,'ERROR_ONE',)
	}
	
	@test()
	protected static async passesWhenCodeAndPayloadMatches() {
		const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
		errorAssertUtil.assertError(err,'ERROR_ONE',{booleanParam: true})
	}
}
