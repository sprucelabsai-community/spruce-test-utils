import assert from '../../assert/assert'
import test, { suite } from '../../decorators'
import AbstractBeforeAllLevelOneTest from './support/AbstractLevelOneTest'

@suite()
export default class TestOnInstanceWithTwoLevelsOfInheritenceTest extends AbstractBeforeAllLevelOneTest {
    @test()
    protected async canCreateTestOnInstanceWithTwoLevelsOfInheritence() {
        assert.isTrue(
            TestOnInstanceWithTwoLevelsOfInheritenceTest.wasBeforeAllLevelTwoCalled
        )

        assert.isTrue(this.wasBeforeEachLevelTwoCalled)
    }
}
