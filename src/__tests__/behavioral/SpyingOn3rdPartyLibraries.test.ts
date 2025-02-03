import AbstractSpruceTest from '../../AbstractSpruceTest'
import assert from '../../assert/assert'
import test from '../../decorators'

export default class SpyingOn3rdPartyLibrariesTest extends AbstractSpruceTest {
    private static spier: Spier
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.spier = Spier.Spier()
    }

    @test()
    protected static spyThrowsWithMissing() {
        //@ts-ignore
        assert.doesThrow(() => this.spier.spy())
    }

    @test()
    protected static doesNotThrowIfPassedRequired() {
        const func = utility1.goTeam
        this.spy(func)
    }

    @test()
    protected static totalCallsStartsAtZero() {
        const spy = this.spy(utility1.goTeam)
        spy.assertCalledTotalTimes(0)
    }

    @test.only()
    protected static countsIfCalledOnce() {
        const spy = this.spy(utility1.goTeam)
        utility1.goTeam()
        assert.doesThrow(() => spy.assertCalledTotalTimes(0))
    }

    private static spy(func: () => void) {
        return this.spier.spy(func)
    }
}

const utility1 = {
    goTeam() {},
}

class Spier {
    public static Spier() {
        return new Spier()
    }

    public spy(fn: SpiedOnComponent) {
        if (!fn) {
            throw new Error('You must pass a function to spy on')
        }

        debugger
        return new Spy(fn)
    }
}

class Spy {
    public constructor(private fn: SpiedOnComponent) {
        this.fn.apply = () => {
            debugger
        }
    }

    public assertCalledTotalTimes(expected: number) {
        debugger
    }
}

type SpiedOnComponent = (...any: []) => any
