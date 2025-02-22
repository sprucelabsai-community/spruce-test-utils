import assert from '../../assert/assert'
import test from '../../decorators'
import AbstractStaticTest from './support/AbstractStaticTest'

export default class StaticParentTestCanAccessParentMethodsTest extends AbstractStaticTest {
    @test()
    protected static async didCallBeforeAllScopedCorrectly() {
        assert.isTrue(
            this.didCallAnotherStaticMethodInBeforeEach,
            'beforeAll in parent class not referrenced'
        )
    }
}
