import AbstractSpruceError from '@sprucelabs/error'
import { assert, assertUtil } from '@sprucelabs/test'
import cloneDeep from 'lodash/cloneDeep'

function removeProps(obj: Record<string, any>, keys: string[]) {
	if (obj instanceof Array) {
		obj.forEach(function (item) {
			removeProps(item, keys)
		})
	} else if (typeof obj === 'object') {
		Object.getOwnPropertyNames(obj).forEach(function (key) {
			if (keys.indexOf(key) !== -1) {
				delete obj[key]
			} else {
				removeProps(obj[key], keys)
			}
		})
	}
}

const errorAssertUtil = {
	assertError(
		error: AbstractSpruceError<any>,
		expectedCode: string,
		expectedPartialOptions?: Record<string, any>
	) {
		if (!error.options) {
			assert.fail(
				`Did not receive a SpruceError, got:\n\nMessage: ${error.message}\nStack: ${error.stack}`
			)
		}
		if (error.options.code === expectedCode) {
			if (expectedPartialOptions) {
				assert.doesInclude(error.options, expectedPartialOptions)
			}
		} else {
			assert.fail(
				`Invalid error code. Expected:\n\n'${expectedCode}'\n\nbut got:\n\nCode: '${
					error.options.code
				}'\nMessage: '${error.message}'\nOptions:${assertUtil.stringify(
					error.options
				)}`
			)
		}
	},

	stripFriendlyMessageFromOptions(
		options: Record<string, any> | Record<string, any>[]
	) {
		const clone = cloneDeep(options)
		removeProps(clone, ['friendlyMessage'])
		return clone
	},
}

export default errorAssertUtil
