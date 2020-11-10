import AbstractSpruceError from '@sprucelabs/error'
import { assert, assertUtil } from '@sprucelabs/test'
import cloneDeep from 'lodash/cloneDeep'

function removeProps(obj: Record<string, any>, keys: string[]) {
	if (obj instanceof Array) {
		obj.forEach(function (item, idx) {
			if (item instanceof AbstractSpruceError) {
				obj[idx] = item = { options: item.options }
			}
			removeProps(item, keys)
		})
	} else if (typeof obj === 'object') {
		Object.getOwnPropertyNames(obj).forEach(function (key) {
			if (obj[key] instanceof AbstractSpruceError) {
				obj[key] = { options: obj[key].options }
				removeProps(obj[key], keys)
			} else if (keys.indexOf(key) !== -1) {
				delete obj[key]
			} else {
				removeProps(obj[key], keys)
			}
		})
	}
}

const errorAssertUtil = {
	assertError(
		error: Error | AbstractSpruceError<any>,
		expectedCode: string,
		expectedPartialOptions?: Record<string, any>
	) {
		const spruceErr = error as AbstractSpruceError<any>

		if (!spruceErr.options) {
			assertUtil.fail(
				`Did not receive a SpruceError, got:\n\nMessage: ${spruceErr.message}`,
				spruceErr.stack
			)
		}
		if (spruceErr.options.code === expectedCode) {
			if (expectedPartialOptions) {
				assert.doesInclude(spruceErr.options, expectedPartialOptions)
			}
		} else {
			assertUtil.fail(
				`Invalid error code. Expected:\n\n'${expectedCode}'\n\nbut got:\n\nCode: '${
					spruceErr.options.code
				}'\nMessage: '${spruceErr.message}'\nOptions:${assertUtil.stringify(
					spruceErr.options
				)}`,
				spruceErr.stack
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
