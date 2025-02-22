import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { suite } from '../../decorators'
import SpruceTestResolver from '../../SpruceTestResolver'

@suite()
export default class SpruceTestDecoratorResolverTest extends AbstractSpruceTest {
    protected static counter = 4

    protected static async beforeAll(): Promise<void> {
        await super.beforeAll()

        assert.isEqual(
            this.counter,
            4,
            'beforeAll did not access correct static property'
        )
    }

    protected static async afterAll(): Promise<void> {
        await super.afterAll()

        assert.isEqual(
            this.counter,
            10,
            'afterAll did not access correct static property'
        )
    }

    @test()
    protected async canCreateSpruceTestDecoratorResolver() {
        SpruceTestDecoratorResolverTest.counter = 10

        const activeTest = SpruceTestResolver.getActiveTest()
        assert.isInstanceOf(
            activeTest,
            SpruceTestDecoratorResolverTest,
            'getActive test is not this on instance test'
        )

        const activeTest2 = SpruceTestResolver.getActiveTest()
        assert.isEqual(
            activeTest,
            activeTest2,
            'getActiveTest called a second time did not return same instance'
        )
    }
}
