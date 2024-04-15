import AbstractSpruceError, {
    ErrorOptions as IErrorOptions,
} from '@sprucelabs/error'
import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test from '../../decorators'
import errorAssert from '../../utilities/errorAssert'

interface ErrorOne extends IErrorOptions {
    code: 'ERROR_ONE'
    booleanParam: boolean
}

interface ErrorTwo extends IErrorOptions {
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
            () => errorAssert.assertError(err, 'ERROR_THREE'),
            /Invalid error code. Expected.*?ERROR_THREE.*?but got.*?ERROR_ONE/gis
        )
    }

    @test()
    protected static async failsWhenErrorIsNotSpruceError() {
        assert.doesThrow(
            //@ts-ignore
            () =>
                errorAssert.assertError(new Error('taco bell'), 'ERROR_THREE'),
            /Did not receive a SpruceError/
        )

        assert.doesThrow(
            //@ts-ignore
            () =>
                errorAssert.assertError(
                    //@ts-ignore
                    { options: { code: 'TEST_ERROR' } },
                    'TEST_ERROR'
                ),
            /Did not receive a SpruceError/
        )
    }

    @test()
    protected static async failsWhenCodeMatchesButOptionsDoNotMatch() {
        const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
        assert.doesThrow(
            () => errorAssert.assertError(err, 'ERROR_ONE', { hello: 'world' }),
            /hello(.*?)was not found in/gis
        )
    }

    @test()
    protected static async passesWhenCodeMatches() {
        const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
        errorAssert.assertError(err, 'ERROR_ONE')
    }

    @test()
    protected static async passesWhenCodeAndPayloadMatches() {
        const err = new TestError({ code: 'ERROR_ONE', booleanParam: true })
        errorAssert.assertError(err, 'ERROR_ONE', { booleanParam: true })
    }

    @test.skip('Enable to review pretty printed output. Always fails.')
    protected static async testPrettyPrinting() {
        try {
            throw new TestError({ code: 'ERROR_ONE', booleanParam: true })
        } catch (err: any) {
            errorAssert.assertError(err, 'ERROR_TWO')
        }
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
    @test(
        'can handle null value',
        {
            results: {
                errors: [
                    {
                        code: 'TEST',
                        aNullValue: null,
                        friendlyMessage: 'go away',
                    },
                ],
            },
        },
        { results: { errors: [{ code: 'TEST', aNullValue: null }] } }
    )
    protected static strippingFriendlyMessage(options: any, expected: any) {
        const actual = errorAssert.stripFriendlyMessageFromOptions(options)
        assert.isEqualDeep(actual, expected)
    }

    @test()
    protected static strippingFriendlyMessageConvertsSpruceErrorToOptions() {
        const actual = errorAssert.stripFriendlyMessageFromOptions({
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
                        options: {
                            code: 'ERROR_ONE',
                            booleanParam: true,
                        },
                    },
                    {
                        options: {
                            code: 'ERROR_TWO',
                            textParam: 'text',
                        },
                    },
                ],
            },
        })
    }
}
