export default abstract class AbstractForInstanceTest {
    protected static wasBeforeAllCalled: boolean
    public static async beforeAll() {
        this.wasBeforeAllCalled = true
    }
}
