import assert from '../../assert/assert'
import test, { SpruceTestResolver, suite } from '../../decorators'
import AbstractTestOnInstanceWithHooksTest from './support/AbstractTestOnInstanceWithHooks'

@suite()
export default class SpruceTestOnInstanceExtendsTestWithHooks extends AbstractTestOnInstanceWithHooksTest {
    @test()
    protected async doesCallBeforeAll() {
        assert.isEqual(
            SpruceTestOnInstanceExtendsTestWithHooks.beforeAllCount,
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
    SpruceTestOnInstanceExtendsTestWithHooks.beforeBeforeAllCount++
})

SpruceTestResolver.onWillBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeBeforeAllCount2++
})

SpruceTestResolver.onAfterBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterBeforeAllCount++
})

SpruceTestResolver.onAfterBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterBeforeAllCount2++
})

SpruceTestResolver.onBeforeBeforeEach(() => {
    SpruceTestResolver.getActiveTest().beforeBeforeEach++
})

SpruceTestResolver.onBeforeBeforeEach(() => {
    SpruceTestResolver.getActiveTest().beforeBeforeEach2++
})

SpruceTestResolver.onAfterBeforeEach(() => {
    SpruceTestResolver.getActiveTest().afterBeforeEach++
})

SpruceTestResolver.onAfterBeforeEach(() => {
    SpruceTestResolver.getActiveTest().afterBeforeEach2++
})

SpruceTestResolver.onBeforeAfterEach(() => {
    SpruceTestResolver.getActiveTest().beforeAfterEach++
})

SpruceTestResolver.onBeforeAfterEach(() => {
    SpruceTestResolver.getActiveTest().beforeAfterEach2++
})

SpruceTestResolver.onAfterAfterEach(() => {
    SpruceTestResolver.getActiveTest().afterAfterEach++
})

SpruceTestResolver.onAfterAfterEach(() => {
    SpruceTestResolver.getActiveTest().afterAfterEach2++
})

SpruceTestResolver.onBeforeAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeAfterAll++
})

SpruceTestResolver.onBeforeAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeAfterAll2++
})

SpruceTestResolver.onAfterAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterAfterAll++
})

SpruceTestResolver.onAfterAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterAfterAll2++
})
