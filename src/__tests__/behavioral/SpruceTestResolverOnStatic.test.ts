import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test from '../../decorators'
import SpruceTestResolver from '../../SpruceTestResolver'

export default class SpruceTestDecoratorResolverOnStaticTest extends AbstractSpruceTest {
    @test()
    protected static async canCreateSpruceTestDecoratorResolverOnStatic() {
        const active = SpruceTestResolver.getActiveTest()
        assert.isEqual(active, SpruceTestDecoratorResolverOnStaticTest)
    }
}
