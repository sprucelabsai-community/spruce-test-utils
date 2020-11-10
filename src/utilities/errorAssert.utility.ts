import AbstractSpruceError from '@sprucelabs/error'
import { assert } from '@sprucelabs/test'
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
