import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { SpruceTestResolver, suite } from '../../decorators'

let beforeAllCount = 0
let beforeEachCount = 0
let afterEachCount = 0

let beforeBeforeAllCount = 0
let beforeBeforeAllCount2 = 0
let afterBeforeAllCount = 0
let afterBeforeAllCount2 = 0

let beforeBeforeEach = 0
let beforeBeforeEach2 = 0

let afterBeforeEach = 0
let afterBeforeEach2 = 0

let beforeAfterEach = 0
let beforeAfterEach2 = 0

let afterAfterEach = 0
let afterAfterEach2 = 0

let beforeAfterAll = 0
let beforeAfterAll2 = 0

let afterAfterAll = 0
let afterAfterAll2 = 0

@suite()
export default class SpruceTest extends AbstractSpruceTest {
    private wasInstancePropertySet = false
    private beforeEachCount = 0
    private static instanceToCheckAfterEach?: SpruceTest

    protected static async beforeAll() {
        assert.isEqual(
            beforeBeforeAllCount,
            1,
            'beforeBeforeAll not called first'
        )
        assert.isEqual(
            beforeBeforeAllCount2,
            1,
            'beforeBeforeAll not called second time'
        )
        assert.isEqual(afterBeforeAllCount, 0, 'afterBeforeAll called too soon')
        assert.isEqual(
            afterBeforeAllCount2,
            0,
            'afterBeforeAll called too soon'
        )
        beforeAllCount += 1

        assert.isEqual(this, SpruceTest)
    }

    protected async beforeEach() {
        beforeEachCount += 1

        assert.isEqual(
            beforeBeforeEach,
            beforeEachCount,
            'beforeBeforeEach not called first'
        )

        assert.isEqual(
            beforeBeforeEach2,
            beforeEachCount,
            'beforeBeforeEach not called second time'
        )

        assert.isEqual(
            afterBeforeEach,
            beforeEachCount - 1,
            'afterBeforeEach called too soon'
        )

        assert.isEqual(
            afterBeforeEach2,
            beforeEachCount - 1,
            'afterBeforeEach called too soon'
        )

        this.beforeEachCount++
        assert.isInstanceOf(this, SpruceTest)
    }

    protected async afterEach() {
        afterEachCount += 1

        assert.isEqual(
            beforeAfterEach,
            afterEachCount,
            'beforeAfterEach not called first'
        )

        assert.isEqual(
            beforeAfterEach2,
            afterEachCount,
            'beforeAfterEach not called second time'
        )

        assert.isEqual(
            afterAfterEach,
            afterEachCount - 1,
            'afterAfterEach called too soon'
        )

        assert.isEqual(
            afterAfterEach2,
            afterEachCount - 1,
            'afterAfterEach called too soon'
        )

        assert.isEqual(beforeAfterAll, 0, 'beforeAfterAll called too soon')
        assert.isEqual(beforeAfterAll2, 0, 'beforeAfterAll called too soon')

        assert.isInstanceOf(this, SpruceTest)
        if (SpruceTest.instanceToCheckAfterEach) {
            assert.isEqual(this, SpruceTest.instanceToCheckAfterEach)
        }
    }

    protected static async afterAll() {
        assert.isTruthy(SpruceTest.instanceToCheckAfterEach)
        assert.isEqual(beforeAllCount, 1, 'beforeAll not called once')
        assert.isEqual(
            afterBeforeAllCount,
            1,
            'afterBeforeAll not called first'
        )
        assert.isEqual(
            afterBeforeAllCount2,
            1,
            'afterBeforeAll not called second time'
        )

        assert.isEqual(beforeAfterAll, 1, 'beforeAfterAll was not called')
        assert.isEqual(beforeAfterAll2, 1, 'beforeAfterAll was not called')

        assert.isEqual(this, SpruceTest)

        assert.isEqual(afterAfterAll, 0, 'afterAfterAll called too soon')
        assert.isEqual(afterAfterAll2, 0, 'afterAfterAll called too soon')

        setTimeout(() => {
            assert.isEqual(afterAfterAll, 1, 'afterAfterAll not called')
            assert.isEqual(afterAfterAll2, 1, 'afterAfterAll not called')
        }, 10)
    }

    @test()
    protected async doesCallBeforeAll() {
        assert.isEqual(beforeAllCount, 1, 'Did not call beforeAll')
    }

    @test()
    protected async basicPassingTest() {
        assert.isTrue(true)
        assert.isFalse(false)
        assert.isEqual(5, 5, `Thing's don't equal`)
    }

    @test('can pass variables to test handler from decorator', 'hello', 'world')
    protected async canAccessVarsFromDecorator(hello: string, world: string) {
        assert.isEqual(hello, 'hello')
        assert.isEqual(world, 'world')
    }

    @test()
    protected async calledBeforeAndAfterEach() {
        assert.isEqual(beforeEachCount, 4)
        assert.isEqual(afterEachCount, 3)
    }

    @test()
    protected async asyncDebuggerWaits() {
        const results = await this.wait(1000)
        assert.isTruthy(results)
    }

    @test.todo('can create a TODO test')
    protected async todo() {
        assert.fail('This test should not run')
    }

    @test()
    protected async settingInstanceProperty() {
        this.wasInstancePropertySet = true
    }

    @test()
    protected async shouldBeResetNow() {
        assert.isFalse(this.wasInstancePropertySet)
    }

    @test.skip()
    protected async skippedTestShouldNotRun() {
        assert.fail('This test should not run')
    }

    @test('can wait for 1000', 1000)
    @test('can wait for 2000', 2000)
    protected async shouldBeAbleToWait(waitMs: number) {
        const now = Date.now()
        await this.wait(waitMs)
        const after = Date.now()

        assert.isBetweenInclusive(after - now, waitMs, waitMs + 20)
    }

    @test('can log simple message', ['hey'])
    @test('can log multiple messages', ['hey', 'there'])
    protected async canLog(messages: string[]) {
        let passedMessages: string | undefined

        //@ts-ignore
        process.stderr.write = (message) => {
            passedMessages = message as string
        }

        const expected = messages.join(' ')

        this.log(...messages)

        assert.isEqual(passedMessages, expected)
    }

    @test()
    protected pwdShouldbeSet() {
        assert.isEqual(this.cwd, process.cwd())
    }

    @test()
    protected async resolvePathShouldWork() {
        await AbstractSpruceTest.beforeAll()
        this.assertResolvePathReturnsSameAsStatic(['test'])
        this.assertResolvePathReturnsSameAsStatic(['test', 'behavioral'])
        this.assertResolvePathReturnsSameAsStatic([
            'test',
            'behavioral',
            'SpruceTestOnInstance.test.ts',
        ])
        this.assertResolvePathReturnsSameAsStatic(['/ok'])
    }

    @test()
    protected async beforeEachCalledOnSameInstance() {
        assert.isEqual(this.beforeEachCount, 1)
    }

    @test()
    protected async afterEachCalledAOnSameInsntance() {
        SpruceTest.instanceToCheckAfterEach = this
    }

    private assertResolvePathReturnsSameAsStatic(parts: string[]) {
        const expected = AbstractSpruceTest.resolvePath(...parts)
        const actual = this.resolvePath(...parts)

        assert.isEqual(actual, expected)
    }
}

SpruceTestResolver.onWillBeforeAll(() => {
    beforeBeforeAllCount++
})

SpruceTestResolver.onWillBeforeAll(() => {
    beforeBeforeAllCount2++
})

SpruceTestResolver.onAfterBeforeAll(() => {
    afterBeforeAllCount++
})

SpruceTestResolver.onAfterBeforeAll(() => {
    afterBeforeAllCount2++
})

SpruceTestResolver.onBeforeBeforeEach(() => {
    beforeBeforeEach++
})

SpruceTestResolver.onBeforeBeforeEach(() => {
    beforeBeforeEach2++
})

SpruceTestResolver.onAfterBeforeEach(() => {
    afterBeforeEach++
})

SpruceTestResolver.onAfterBeforeEach(() => {
    afterBeforeEach2++
})

SpruceTestResolver.onBeforeAfterEach(() => {
    beforeAfterEach++
})

SpruceTestResolver.onBeforeAfterEach(() => {
    beforeAfterEach2++
})

SpruceTestResolver.onAfterAfterEach(() => {
    afterAfterEach++
})

SpruceTestResolver.onAfterAfterEach(() => {
    afterAfterEach2++
})

SpruceTestResolver.onBeforeAfterAll(() => {
    beforeAfterAll++
})

SpruceTestResolver.onBeforeAfterAll(() => {
    beforeAfterAll2++
})

SpruceTestResolver.onAfterAfterAll(() => {
    afterAfterAll++
})

SpruceTestResolver.onAfterAfterAll(() => {
    afterAfterAll2++
})
