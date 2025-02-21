import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { SpruceTestDecoratorResolver, suite } from '../../decorators'

@suite()
export default class SpruceTestDecoratorResolverTest extends AbstractSpruceTest {
    protected static async afterAll(): Promise<void> {
        await super.afterAll()
        const activeTest = SpruceTestDecoratorResolver.getActiveTest()
        assert.isFalsy(activeTest)
    }

    @test()
    protected async canCreateSpruceTestDecoratorResolver() {
        const activeTest = SpruceTestDecoratorResolver.getActiveTest()
        assert.isInstanceOf(activeTest, SpruceTestDecoratorResolverTest)

        const activeTest2 = SpruceTestDecoratorResolver.getActiveTest()
        assert.isEqual(activeTest, activeTest2)
    }
}
