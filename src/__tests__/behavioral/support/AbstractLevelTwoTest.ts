import AbstractSpruceTest from '../../../AbstractSpruceTest'

export default abstract class AbstractBeforeAllLevelTwoTest extends AbstractSpruceTest {
    protected static wasBeforeAllLevelTwoCalled = false
    protected wasBeforeEachLevelTwoCalled = false

    protected static async beforeAll() {
        await super.beforeAll()
        debugger
        this.wasBeforeAllLevelTwoCalled = true
    }

    protected async beforeEach(): Promise<void> {
        debugger
        await super.beforeEach()
        this.wasBeforeEachLevelTwoCalled = true
    }
}
