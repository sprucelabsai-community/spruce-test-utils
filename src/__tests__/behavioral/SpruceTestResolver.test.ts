import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { SpruceTestResolver, suite } from '../../decorators'

@suite()
export default class SpruceTestDecoratorResolverTest extends AbstractSpruceTest {
    protected static async afterAll(): Promise<void> {
        await super.afterAll()
        const activeTest = SpruceTestResolver.getActiveTest()
        assert.isFalsy(activeTest)
    }

    @test()
    protected async canCreateSpruceTestDecoratorResolver() {
        const activeTest = SpruceTestResolver.getActiveTest()
        assert.isInstanceOf(activeTest, SpruceTestDecoratorResolverTest)

        const activeTest2 = SpruceTestResolver.getActiveTest()
        assert.isEqual(activeTest, activeTest2)
    }
}
