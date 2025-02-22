import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test from '../../decorators'

export default class StaticTestInheritsAbstractSpruceTestProperlyTest extends AbstractSpruceTest {
    @test('checking if cwd is set')
    protected static canCreateStaticTestInheritsAbstractSpruceTestProperly() {
        assert.isEqual(this.cwd, process.cwd())
        this.resolvePath('hello')
    }
}
