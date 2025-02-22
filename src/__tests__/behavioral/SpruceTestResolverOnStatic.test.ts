import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test, { SpruceTestResolver } from '../../decorators'

export default class SpruceTestDecoratorResolverOnStaticTest extends AbstractSpruceTest {
    @test()
    protected static async canCreateSpruceTestDecoratorResolverOnStatic() {
        const active = SpruceTestResolver.getActiveTest()
        assert.isEqual(active, SpruceTestDecoratorResolverOnStaticTest)
    }
}
