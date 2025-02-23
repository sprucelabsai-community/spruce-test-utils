import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { suite } from '../../decorators'
import SpruceTestResolver from '../../SpruceTestResolver'

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

let beforeBeforeEachTest: any
let afterBeforeEachTest: any
let beforeAfterEachTest: any
let afterAfterEachTest: any

let beforeAfterAllTest: any
let afterAfterAllTest: any
let beforeBeforeAllTest: any
let afterBeforeAllTest: any

@suite()
export default class SpruceTestOnInstanceTest extends AbstractSpruceTest {
    private wasInstancePropertySet = false
    private beforeEachCount = 0
    private static instanceToCheckAfterEach?: SpruceTestOnInstanceTest

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

        assert.isEqual(this, SpruceTestOnInstanceTest)
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
        assert.isInstanceOf(this, SpruceTestOnInstanceTest)
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

        assert.isInstanceOf(this, SpruceTestOnInstanceTest)
        if (SpruceTestOnInstanceTest.instanceToCheckAfterEach) {
            assert.isEqual(
                this,
                SpruceTestOnInstanceTest.instanceToCheckAfterEach
            )
        }
    }

    protected static async afterAll() {
        assert.isTruthy(SpruceTestOnInstanceTest.instanceToCheckAfterEach)
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

        assert.isEqual(this, SpruceTestOnInstanceTest)

        assert.isEqual(afterAfterAll, 0, 'afterAfterAll called too soon')
        assert.isEqual(afterAfterAll2, 0, 'afterAfterAll called too soon')

        assert.isEqual(
            beforeBeforeAllTest,
            SpruceTestOnInstanceTest,
            'beforeAll did not pass test class'
        )

        setTimeout(() => {
            assert.isEqual(afterAfterAll, 1, 'afterAfterAll not called')
            assert.isEqual(afterAfterAll2, 1, 'afterAfterAll not called')
            assert.isEqual(
                beforeBeforeAllTest,
                SpruceTestOnInstanceTest,
                'beforeAll did not pass test class'
            )
            assert.isEqual(
                afterBeforeAllTest,
                SpruceTestOnInstanceTest,
                'afterBeforeAll did not pass test class'
            )
            assert.isEqual(
                beforeAfterAllTest,
                SpruceTestOnInstanceTest,
                'beforeAfterAll did not pass test class'
            )
            assert.isEqual(
                afterAfterAllTest,
                SpruceTestOnInstanceTest,
                'afterAfterAll did not pass test class'
            )
        }, 1)

        assert.isEqual(
            beforeBeforeEachTest,
            SpruceTestOnInstanceTest.instanceToCheckAfterEach,
            'Did not pass test instance to beforeBeforeEach'
        )

        assert.isEqual(
            afterBeforeEachTest,
            SpruceTestOnInstanceTest.instanceToCheckAfterEach,
            'Did not pass test instance to afterBeforeEach'
        )

        assert.isEqual(
            beforeAfterEachTest,
            SpruceTestOnInstanceTest.instanceToCheckAfterEach,
            'Did not pass test instance to beforeAfterEach'
        )

        assert.isEqual(
            afterAfterEachTest,
            SpruceTestOnInstanceTest.instanceToCheckAfterEach,
            'Did not pass test instance to afterAfterEach'
        )
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
    protected async asyncWaits() {
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

    @test('simple single parameter', 'test')
    protected passesThroughSimpleParameter(param1: any) {
        assert.isEqual(param1, 'test')
    }

    @test('array singe parameter', [1])
    protected passesThroughARrayParameter(param1: any) {
        assert.isEqualDeep(param1, [1])
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
        SpruceTestOnInstanceTest.instanceToCheckAfterEach = this
    }

    private assertResolvePathReturnsSameAsStatic(parts: string[]) {
        const expected = AbstractSpruceTest.resolvePath(...parts)
        const actual = this.resolvePath(...parts)

        assert.isEqual(actual, expected)
    }
}

SpruceTestResolver.onWillCallBeforeAll((Test) => {
    beforeBeforeAllTest = Test
    beforeBeforeAllCount++
})

SpruceTestResolver.onWillCallBeforeAll(() => {
    beforeBeforeAllCount2++
})

SpruceTestResolver.onDidCallBeforeAll((Test) => {
    afterBeforeAllTest = Test
    afterBeforeAllCount++
})

SpruceTestResolver.onDidCallBeforeAll(() => {
    afterBeforeAllCount2++
})

SpruceTestResolver.onWillCallBeforeEach((Test) => {
    beforeBeforeEachTest = Test
    beforeBeforeEach++
})

SpruceTestResolver.onWillCallBeforeEach(() => {
    beforeBeforeEach2++
})

SpruceTestResolver.onDidCallBeforeEach((Test) => {
    afterBeforeEachTest = Test
    afterBeforeEach++
})

SpruceTestResolver.onDidCallBeforeEach(() => {
    afterBeforeEach2++
})

SpruceTestResolver.onWillCallAfterEach((Test) => {
    beforeAfterEachTest = Test
    beforeAfterEach++
})

SpruceTestResolver.onWillCallAfterEach(() => {
    beforeAfterEach2++
})

SpruceTestResolver.onDidCallAfterEach((Test) => {
    afterAfterEachTest = Test
    afterAfterEach++
})

SpruceTestResolver.onDidCallAfterEach(() => {
    afterAfterEach2++
})

SpruceTestResolver.onWillCallAfterAll((Test) => {
    beforeAfterAllTest = Test
    beforeAfterAll++
})

SpruceTestResolver.onWillCallAfterAll(() => {
    beforeAfterAll2++
})

SpruceTestResolver.onDidCallAfterAll((Test) => {
    afterAfterAll++
    afterAfterAllTest = Test
})

SpruceTestResolver.onDidCallAfterAll(() => {
    afterAfterAll2++
})
