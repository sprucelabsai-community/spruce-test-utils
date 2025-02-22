import assert from '../../assert/assert'
import test from '../../decorators'
import SpruceTestResolver from '../../SpruceTestResolver'

let beforeBeforeAllCount = 0
let afterBeforeAllCount = 0
let beforeAfterAll = 0

export default class AllHooksCalledEvenIfNotDefinedTest {
    protected static async afterAll() {
        assert.isEqual(beforeBeforeAllCount, 1)
        assert.isEqual(afterBeforeAllCount, 1)
        assert.isEqual(beforeAfterAll, 1)
    }

    @test()
    protected static async canCreateAllHooksCalledEvenIfNotDefined() {}
}

SpruceTestResolver.onWillCallBeforeAll(() => {
    beforeBeforeAllCount++
})

SpruceTestResolver.onDidCallBeforeAll(() => {
    afterBeforeAllCount++
})

SpruceTestResolver.onWillCallAfterAll(() => {
    beforeAfterAll++
})
