import AbstractSpruceTest from '../../../AbstractSpruceTest'

export default abstract class AbstractStaticTest extends AbstractSpruceTest {
    protected static didCallAnotherStaticMethodInBeforeEach = false
    protected static didSetInBeforeAll: boolean

    protected static async beforeAll() {
        await super.beforeAll()
        this.callAnotherStaticMethod()
        this.didSetInBeforeAll = true
    }

    private static callAnotherStaticMethod() {
        this.didCallAnotherStaticMethodInBeforeEach = true
    }
}
