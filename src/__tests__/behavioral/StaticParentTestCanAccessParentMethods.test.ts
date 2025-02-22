import assert from '../../assert/assert'
import test from '../../decorators'
import AbstractStaticTest from './support/AbstractStaticTest'

export default class StaticParentTestCanAccessParentMethodsTest extends AbstractStaticTest {
    protected static didCallFirstTest = false

    protected static async afterAll(): Promise<void> {
        await super.afterAll()
        assert.isTrue(
            this.didCallAnotherStaticMethodInBeforeEach,
            'beforeAll in parent class not referrenced'
        )

        assert.isTrue(this.didCallFirstTest, 'First test was not called')
    }

    @test()
    protected static async didCallBeforeAllScopedCorrectly() {
        this.didCallFirstTest = true
        assert.isTrue(
            this.didCallAnotherStaticMethodInBeforeEach,
            'beforeAll in parent class not referrenced'
        )
    }

    @test()
    protected static async shouldCallFirstTest() {
        assert.isTrue(this.didCallFirstTest, 'First test was not called')
    }
}
