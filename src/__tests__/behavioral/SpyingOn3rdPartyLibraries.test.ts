import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test from '../../decorators'
import generateId from '../../utilities/generateId.utility'
import Spier from '../../utilities/spies/Spier'

export default class SpyingOn3rdPartyLibrariesTest extends AbstractSpruceTest {
    private static spier: Spier
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.spier = Spier.Spier()

        utility1.wasAnotherSimpleMethodNoArgsCalled = false
        utility1.wasSimpleMethodNoArgsCalled = false
    }

    @test()
    protected static spyThrowsWithMissing() {
        //@ts-ignore
        assert.doesThrow(() => this.spier.spy())
    }

    @test()
    protected static doesNotThrowIfPassedRequired() {
        this.spy(utility1, 'simpleMethodNoArgs')
    }

    @test()
    protected static totalCallsStartsAtZero() {
        const method = 'simpleMethodNoArgs'
        const spy = this.spyOnMethod(method)
        spy.assertCalledTotalTimes(0)
    }

    @test()
    protected static countsIfCalledOnce() {
        const spy = this.spyOnMethod('simpleMethodNoArgs')
        utility1.simpleMethodNoArgs()
        assert.doesThrow(() => spy.assertCalledTotalTimes(0))
        spy.assertCalledTotalTimes(1)
        utility1.simpleMethodNoArgs()
        assert.doesThrow(() => spy.assertCalledTotalTimes(1))
        spy.assertCalledTotalTimes(2)
    }

    @test()
    protected static async canSpyOnDifferentMethod() {
        const spy = this.spyOnMethod('anotherSimpleMethodNoArgs')
        utility1.anotherSimpleMethodNoArgs()
        spy.assertCalledTotalTimes(1)
    }

    @test()
    protected static async callsOriginalMethod() {
        this.spyOnMethod('simpleMethodNoArgs')
        assert.isFalse(
            utility1.wasAnotherSimpleMethodNoArgsCalled,
            'should not have called original method yet'
        )
        utility1.anotherSimpleMethodNoArgs()
        assert.isTrue(
            utility1.wasAnotherSimpleMethodNoArgsCalled,
            'did not call original method'
        )
    }

    @test()
    protected static async callsDifferentOriginalMethod() {
        this.spyOnMethod('anotherSimpleMethodNoArgs')
        assert.isFalse(
            utility1.wasSimpleMethodNoArgsCalled,
            'should not have called original method yet'
        )
        utility1.simpleMethodNoArgs()
        assert.isTrue(
            utility1.wasSimpleMethodNoArgsCalled,
            'did not call original method'
        )
    }

    @test()
    protected static async canCleanupSpy() {
        const spy = this.spyOnMethod('simpleMethodNoArgs')

        Spier.Spier()

        utility1.simpleMethodNoArgs()
        spy.assertCalledTotalTimes(0)
    }

    @test()
    protected static canSpyOnMultipleMethodsAndResetBoth() {
        const spy1 = this.spyOnMethod('simpleMethodNoArgs')
        const spy2 = this.spyOnMethod('anotherSimpleMethodNoArgs')

        Spier.Spier()

        utility1.simpleMethodNoArgs()
        utility1.anotherSimpleMethodNoArgs()

        spy1.assertCalledTotalTimes(0)
        spy2.assertCalledTotalTimes(0)
    }

    @test()
    protected static shouldNotRetainSpys() {
        const spy = this.spyOnMethod('simpleMethodNoArgs')
        Spier.Spier()
        spy.reset = () => {
            throw new Error('Should not have been called')
        }

        Spier.Spier()
    }

    @test()
    protected static async spyingRetainsReturnValueTrue() {
        this.spyOnMethod('methodThatReturnsTrue')
        const results = utility1.methodThatReturnsTrue()
        assert.isTrue(results, 'Should have returned true')
    }

    @test()
    protected static async spyingRetainsReturnValueFalse() {
        this.spyOnMethod('methodThatReturnsFalse')
        const results = utility1.methodThatReturnsFalse()
        assert.isFalse(results, 'Should have returned false')
    }

    @test()
    protected static canSpyOnDifferentObject() {
        const spy = this.spyOnMethod('aSimpleMethod', utility2)
        utility2.aSimpleMethod()
        spy.assertCalledTotalTimes(1)
    }

    @test()
    protected static passesThroughOneArgument() {
        const arg = generateId()
        this.spyOnMethod('methodWithOneArgument')
        utility1.methodWithOneArgument(arg)

        assert.isEqual(utility1.passedOneArgument, arg)
    }

    @test()
    protected static canPassThroughTwoArguments() {
        const arg1 = generateId()
        const arg2 = generateId()

        this.spyOnMethod('methodWithTwoArguments')

        utility1.methodWithTwoArguments(arg1, arg2)

        assert.isEqual(utility1.passedOneArgument, arg1)
        assert.isEqual(utility1.passedTwoArgument, arg2)
    }

    @test()
    protected static canAssertCalledWithSingleArgument() {
        const arg1 = generateId()

        const spy = this.spyOnMethod('methodWithOneArgument')

        utility1.methodWithOneArgument(arg1)

        spy.assertLastCalledWith([arg1])

        assert.doesThrow(() => spy.assertLastCalledWith([generateId()]))
    }

    @test()
    protected static canAssertCalledWithTwoArguments() {
        const arg1 = generateId()
        const arg2 = generateId()

        const spy = this.spyOnMethod('methodWithTwoArguments')

        utility1.methodWithTwoArguments(arg1, arg2)

        spy.assertLastCalledWith([arg1, arg2])

        assert.doesThrow(() =>
            spy.assertLastCalledWith([generateId(), generateId()])
        )

        assert.doesThrow(() => spy.assertLastCalledWith([arg1, generateId()]))
    }

    @test()
    protected static async canSpyOnInstanceOfSomething() {
        const instance = new StubUtility()
        const spy = this.spy(instance, 'tacoBravo')
        instance.tacoBravo()
        spy.assertCalledTotalTimes(1)
    }

    @test()
    protected static async canHandleAsyncOnInstance() {
        const instance = new StubUtility()
        const spy = this.spy(instance, 'tacoBravoAsync')
        await instance.tacoBravoAsync()
        spy.assertCalledTotalTimes(1)
    }

    private static spyOnMethod(
        method: Utility1Method | Utility2Method,
        object: Utility1 | Utility2 = utility1
    ) {
        //@ts-ignore
        return this.spy(object, method)
    }

    private static spy<T extends Record<string, any>>(
        object: T,
        method: keyof T
    ) {
        return this.spier.spy(object, method)
    }
}

const utility1 = {
    wasAnotherSimpleMethodNoArgsCalled: false,
    wasSimpleMethodNoArgsCalled: false,
    passedOneArgument: '',
    passedTwoArgument: '',
    simpleMethodNoArgs() {
        this.wasSimpleMethodNoArgsCalled = true
    },
    anotherSimpleMethodNoArgs() {
        this.wasAnotherSimpleMethodNoArgsCalled = true
    },

    methodThatReturnsTrue() {
        return true
    },

    methodThatReturnsFalse() {
        return false
    },

    methodWithOneArgument(arg: string) {
        this.passedOneArgument = arg
    },

    methodWithTwoArguments(arg1: string, arg2: string) {
        this.passedOneArgument = arg1
        this.passedTwoArgument = arg2
    },
}

const utility2 = {
    aSimpleMethod() {},
}

type Utility1 = typeof utility1
type Utility1Method = keyof Utility1

type Utility2 = typeof utility2
type Utility2Method = keyof Utility2

class StubUtility {
    public tacoBravo() {}
    public async tacoBravoAsync() {}
}
