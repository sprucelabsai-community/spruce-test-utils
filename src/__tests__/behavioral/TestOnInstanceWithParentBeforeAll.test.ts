import assert from '../../assert/assert'
import test, { suite } from '../../decorators'
import AbstractForInstanceTest from '../support/AbstractForInstanceTest'

@suite()
export default class TestOnInstanceWithParentBeforeAllTest extends AbstractForInstanceTest {
    @test()
    protected async canCreateTestOnInstanceWithParentBeforeAll() {
        debugger
        assert.isTrue(
            TestOnInstanceWithParentBeforeAllTest.wasBeforeAllCalled,
            'beforeAll was not called on parent class'
        )
    }
}
