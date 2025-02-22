import assert from '../../assert/assert'
import test, { SpruceTestResolver, suite } from '../../decorators'
import AbstractTestOnInstanceTest from './support/AbstractTestOnInstanceTest'

@suite()
export default class SpruceTestOnInstanceExtendsTest extends AbstractTestOnInstanceTest {
    protected static async beforeAll() {
        assert.isEqual(
            this.beforeBeforeAllCount,
            1,
            'beforeBeforeAll not called first'
        )
        assert.isEqual(
            this.beforeBeforeAllCount2,
            1,
            'beforeBeforeAll not called second time'
        )
        assert.isEqual(
            this.afterBeforeAllCount,
            0,
            'afterBeforeAll called too soon'
        )
        assert.isEqual(
            this.afterBeforeAllCount2,
            0,
            'afterBeforeAll called too soon'
        )
        this.beforeAllCount += 1

        assert.isEqual(this, SpruceTestOnInstanceExtendsTest)
    }

    protected async beforeEach() {
        SpruceTestOnInstanceExtendsTest.beforeEachCount += 1
        debugger

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeBeforeEach,
            SpruceTestOnInstanceExtendsTest.beforeEachCount,
            'beforeBeforeEach not called first'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeBeforeEach2,
            SpruceTestOnInstanceExtendsTest.beforeEachCount,
            'beforeBeforeEach not called second time'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterBeforeEach,
            SpruceTestOnInstanceExtendsTest.beforeEachCount - 1,
            'afterBeforeEach called too soon'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterBeforeEach2,
            SpruceTestOnInstanceExtendsTest.beforeEachCount - 1,
            'afterBeforeEach called too soon'
        )

        assert.isInstanceOf(this, SpruceTestOnInstanceExtendsTest)
    }

    protected async afterEach() {
        SpruceTestOnInstanceExtendsTest.afterEachCount += 1

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAfterEach,
            SpruceTestOnInstanceExtendsTest.afterEachCount,
            'beforeAfterEach not called first'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAfterEach2,
            SpruceTestOnInstanceExtendsTest.afterEachCount,
            'beforeAfterEach not called second time'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterAfterEach,
            SpruceTestOnInstanceExtendsTest.afterEachCount - 1,
            'afterAfterEach called too soon'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterAfterEach2,
            SpruceTestOnInstanceExtendsTest.afterEachCount - 1,
            'afterAfterEach called too soon'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAfterAll,
            0,
            'beforeAfterAll called too soon'
        )
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAfterAll2,
            0,
            'beforeAfterAll called too soon'
        )

        assert.isInstanceOf(this, SpruceTestOnInstanceExtendsTest)
    }

    protected static async afterAll() {
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAllCount,
            1,
            'beforeAll not called once'
        )
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterBeforeAllCount,
            1,
            'afterBeforeAll not called first'
        )
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterBeforeAllCount2,
            1,
            'afterBeforeAll not called second time'
        )

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAfterAll,
            1,
            'beforeAfterAll was not called'
        )
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAfterAll2,
            1,
            'beforeAfterAll was not called'
        )

        assert.isEqual(this, SpruceTestOnInstanceExtendsTest)

        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterAfterAll,
            0,
            'afterAfterAll called too soon'
        )
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.afterAfterAll2,
            0,
            'afterAfterAll called too soon'
        )

        setTimeout(() => {
            assert.isEqual(
                SpruceTestOnInstanceExtendsTest.afterAfterAll,
                1,
                'afterAfterAll not called'
            )
            assert.isEqual(
                SpruceTestOnInstanceExtendsTest.afterAfterAll2,
                1,
                'afterAfterAll not called'
            )
        }, 10)
    }

    @test()
    protected async doesCallBeforeAll() {
        assert.isEqual(
            SpruceTestOnInstanceExtendsTest.beforeAllCount,
            1,
            'Did not call beforeAll'
        )
    }

    @test()
    protected async basicPassingTest() {
        assert.isTrue(true)
    }
}

SpruceTestResolver.onWillBeforeAll(() => {
    SpruceTestOnInstanceExtendsTest.beforeBeforeAllCount++
})

SpruceTestResolver.onWillBeforeAll(() => {
    SpruceTestOnInstanceExtendsTest.beforeBeforeAllCount2++
})

SpruceTestResolver.onAfterBeforeAll(() => {
    SpruceTestOnInstanceExtendsTest.afterBeforeAllCount++
})

SpruceTestResolver.onAfterBeforeAll(() => {
    SpruceTestOnInstanceExtendsTest.afterBeforeAllCount2++
})

SpruceTestResolver.onBeforeBeforeEach(() => {
    debugger
    SpruceTestOnInstanceExtendsTest.beforeBeforeEach++
})

SpruceTestResolver.onBeforeBeforeEach(() => {
    SpruceTestOnInstanceExtendsTest.beforeBeforeEach2++
})

SpruceTestResolver.onAfterBeforeEach(() => {
    SpruceTestOnInstanceExtendsTest.afterBeforeEach++
})

SpruceTestResolver.onAfterBeforeEach(() => {
    SpruceTestOnInstanceExtendsTest.afterBeforeEach2++
})

SpruceTestResolver.onBeforeAfterEach(() => {
    SpruceTestOnInstanceExtendsTest.beforeAfterEach++
})

SpruceTestResolver.onBeforeAfterEach(() => {
    SpruceTestOnInstanceExtendsTest.beforeAfterEach2++
})

SpruceTestResolver.onAfterAfterEach(() => {
    SpruceTestOnInstanceExtendsTest.afterAfterEach++
})

SpruceTestResolver.onAfterAfterEach(() => {
    SpruceTestOnInstanceExtendsTest.afterAfterEach2++
})

SpruceTestResolver.onBeforeAfterAll(() => {
    SpruceTestOnInstanceExtendsTest.beforeAfterAll++
})

SpruceTestResolver.onBeforeAfterAll(() => {
    SpruceTestOnInstanceExtendsTest.beforeAfterAll2++
})

SpruceTestResolver.onAfterAfterAll(() => {
    SpruceTestOnInstanceExtendsTest.afterAfterAll++
})

SpruceTestResolver.onAfterAfterAll(() => {
    SpruceTestOnInstanceExtendsTest.afterAfterAll2++
})
