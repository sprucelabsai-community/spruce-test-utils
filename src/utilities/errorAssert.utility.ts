import { assert } from "@sprucelabs/test"
import AbstractSpruceError from '@sprucelabs/error'

const errorAssertUtil = {
	assertError(
		error: AbstractSpruceError<any>,
		expectedCode: string,
		expectedPartialOptions?: Record<string, any>
	) {
		if (error.options.code === expectedCode) {
			if (expectedPartialOptions) {
				assert.doesInclude(error.options, expectedPartialOptions)
			}
		} else {
			assert.fail(
				`Invalid error code. Expected ${expectedCode} but got ${error.options.code}`
			)
		}
	}
}

export default errorAssertUtil