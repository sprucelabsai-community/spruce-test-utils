import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { suite } from '../../decorators'

let beforeAllCount = 0
let beforeEachCount = 0
let afterEachCount = 0

@suite()
export default class SpruceTest extends AbstractSpruceTest {
    private wasInstancePropertySet = false

    protected static async beforeAll() {
        beforeAllCount += 1
    }

    protected async beforeEach() {
        beforeEachCount += 1
    }

    protected async afterEach() {
        afterEachCount += 1
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
        // TODO
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
}
