import assert from '../../assert/assert'
import test, { suite } from '../../decorators'
import AbstractStaticTest from './support/AbstractStaticTest'

@suite()
export default class InstanceParentTestCanAccessParentMethodsTest extends AbstractStaticTest {
    @test()
    protected async canCreateInstanceParentTestCanAccessParentMethods() {
        assert.isTrue(
            InstanceParentTestCanAccessParentMethodsTest.didCallAnotherStaticMethodInBeforeEach,
            'beforeAll in parent class not referrenced'
        )
    }
}
