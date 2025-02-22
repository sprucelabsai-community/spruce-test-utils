import AbstractSpruceTest from '../../../AbstractSpruceTest'

export default abstract class AbstractStaticTest extends AbstractSpruceTest {
    protected static didCallAnotherStaticMethodInBeforeEach = false
    protected static async beforeAll() {
        await super.beforeAll()
        this.callAnotherStaticMethod()
    }
    private static callAnotherStaticMethod() {
        this.didCallAnotherStaticMethodInBeforeEach = true
    }
}
