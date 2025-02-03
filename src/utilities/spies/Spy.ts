import assert from '../../assert/assert'

export default class Spy<T extends Record<string, any>, M extends keyof T> {
    private method: M
    private hitCount = 0
    private originalMethod: any
    private object: T
    private lastArgs?: any[]

    public constructor(object: T, method: M) {
        this.originalMethod = object[method].bind(object)
        this.method = method
        this.object = object

        //@ts-ignore
        this.object[method] = (...args: any[]) => {
            this.hitCount++
            this.lastArgs = args
            return this.originalMethod(...args)
        }
    }

    public assertCalledTotalTimes(expected: number) {
        if (this.hitCount !== expected) {
            throw new Error(
                `${String(this.method)} was not called ${expected} time(s)! It was called ${this.hitCount} time(s).`
            )
        }
    }

    public assertLastCalledWith(args: string[]) {
        assert.isEqualDeep(
            this.lastArgs,
            args,
            `${String(this.method)} was not called with the expected argument`
        )
    }

    public reset() {
        this.object[this.method] = this.originalMethod
    }
}
