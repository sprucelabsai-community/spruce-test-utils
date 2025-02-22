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

SpruceTestResolver.onWillCallBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeBeforeAllCount++
})

SpruceTestResolver.onWillCallBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeBeforeAllCount2++
})

SpruceTestResolver.onDidBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterBeforeAllCount++
})

SpruceTestResolver.onDidBeforeAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterBeforeAllCount2++
})

SpruceTestResolver.onWillCallBeforeEach(() => {
    SpruceTestResolver.getActiveTest().beforeBeforeEach++
})

SpruceTestResolver.onWillCallBeforeEach(() => {
    SpruceTestResolver.getActiveTest().beforeBeforeEach2++
})

SpruceTestResolver.onDidCallBeforeEach(() => {
    SpruceTestResolver.getActiveTest().afterBeforeEach++
})

SpruceTestResolver.onDidCallBeforeEach(() => {
    SpruceTestResolver.getActiveTest().afterBeforeEach2++
})

SpruceTestResolver.onWillCallAfterEach(() => {
    SpruceTestResolver.getActiveTest().beforeAfterEach++
})

SpruceTestResolver.onWillCallAfterEach(() => {
    SpruceTestResolver.getActiveTest().beforeAfterEach2++
})

SpruceTestResolver.onDidCallAfterEach(() => {
    SpruceTestResolver.getActiveTest().afterAfterEach++
})

SpruceTestResolver.onDidCallAfterEach(() => {
    SpruceTestResolver.getActiveTest().afterAfterEach2++
})

SpruceTestResolver.onWillCallAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeAfterAll++
})

SpruceTestResolver.onWillCallAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.beforeAfterAll2++
})

SpruceTestResolver.onDidCallAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterAfterAll++
})

SpruceTestResolver.onDidCallAfterAll(() => {
    SpruceTestOnInstanceExtendsTestWithHooks.afterAfterAll2++
})
