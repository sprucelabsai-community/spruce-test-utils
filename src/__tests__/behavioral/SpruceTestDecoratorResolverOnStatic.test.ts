import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { SpruceTestDecoratorResolver } from '../../decorators'

export default class SpruceTestDecoratorResolverOnStaticTest extends AbstractSpruceTest {
    @test()
    protected static async canCreateSpruceTestDecoratorResolverOnStatic() {
        const active = SpruceTestDecoratorResolver.getActiveTest()
        assert.isEqual(active, SpruceTestDecoratorResolverOnStaticTest)
    }
}
