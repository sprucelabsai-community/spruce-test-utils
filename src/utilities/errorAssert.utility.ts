const errorAssertUtil = {
	assertError(
		error: SpruceError,
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