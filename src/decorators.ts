if (typeof it === 'undefined') {
    //@ts-ignore
    global.it = () => {}
}

type TestLifecycleListener = () => any | Promise<any>
type TestLifecycleListenerWithTest = (Test: any) => any | Promise<any>

export class TestLifecycleListeners {
    public static willBeforeAllListeners: TestLifecycleListener[] = []
    public static didBeforeAllListeners: TestLifecycleListener[] = []

    public static willBeforeEachListeners: TestLifecycleListenerWithTest[] = []
    public static didBeforeEachListeners: TestLifecycleListenerWithTest[] = []

    public static willAfterEachListeners: TestLifecycleListenerWithTest[] = []
    public static didAfterEachListeners: TestLifecycleListenerWithTest[] = []

    public static willAfterAllListeners: TestLifecycleListener[] = []
    public static didAfterAllListeners: TestLifecycleListener[] = []

    public static async emitWillRunBeforeAll() {
        for (const cb of this.willBeforeAllListeners) {
            await cb()
        }
    }

    public static async emitDidRunBeforeAll() {
        for (const cb of this.didBeforeAllListeners) {
            await cb()
        }
    }

    public static async emitWillRunBeforeEach() {
        for (const cb of this.willBeforeEachListeners) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async emitDidRunBeforeEach() {
        for (const cb of this.didBeforeEachListeners) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async emitWillRunAfterEach() {
        for (const cb of this.willAfterEachListeners) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async emitDidRunAfterEach() {
        for (const cb of this.didAfterEachListeners) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async emitWillRunAfterAll() {
        for (const cb of this.willAfterAllListeners) {
            await cb()
        }
    }

    public static async emitDidRunAfterAll() {
        for (const cb of this.didAfterAllListeners) {
            await cb()
        }
    }
}

export class SpruceTestResolver {
    public static ActiveTestClass?: any
    private static __activeTest: any

    public static resolveTestClass(target: any) {
        if (!this.__activeTest) {
            this.__activeTest = this.ActiveTestClass
                ? new this.ActiveTestClass()
                : target
        }

        return this.__activeTest
    }

    public static getActiveTest() {
        return this.__activeTest
    }

    public static onWillCallBeforeAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.willBeforeAllListeners.push(cb)
    }

    public static onDidBeforeAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.didBeforeAllListeners.push(cb)
    }

    public static onWillCallBeforeEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.willBeforeEachListeners.push(cb)
    }

    public static onDidCallBeforeEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.didBeforeEachListeners.push(cb)
    }

    public static onWillCallAfterEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.willAfterEachListeners.push(cb)
    }

    public static onDidCallAfterEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.didAfterEachListeners.push(cb)
    }

    public static onWillCallAfterAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.willAfterAllListeners.push(cb)
    }

    public static onDidCallAfterAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.didAfterAllListeners.push(cb)
    }
}

//recursive function to get static method by name looping up through constructor chain
function resolveMethod(Target: any, name: string) {
    if (Target[name]) {
        return Target[name]
    }

    if (Target.constructor && Target.constructor !== Target) {
        return resolveMethod(Target.constructor, name)
    }

    return null
}

/** Hooks up before, after, etc. */
function hookupTestClassToJestLifecycle(Target: any, h?: string[]) {
    if (Target.__isTestingHookedUp) {
        return
    }

    Target.__isTestingHookedUp = !h
    const hooks = h ?? ['beforeAll', 'beforeEach', 'afterAll', 'afterEach']
    hooks.forEach((hook) => {
        const cb = resolveMethod(Target, hook)
        // Have they defined a hook
        if (!cb) {
            return
        }

        // @ts-ignore
        if (global[hook]) {
            // @ts-ignore
            global[hook](async () => {
                if (hook === 'beforeEach') {
                    SpruceTestResolver.resolveTestClass(Target)
                    await TestLifecycleListeners.emitWillRunBeforeEach()
                    await runBeforeEach(Target)
                    await TestLifecycleListeners.emitDidRunBeforeEach()
                } else if (hook === 'afterEach') {
                    await TestLifecycleListeners.emitWillRunAfterEach()
                    await runAfterEach(Target)
                    await TestLifecycleListeners.emitDidRunAfterEach()

                    // @ts-ignore
                    delete SpruceTestResolver.__activeTest
                } else {
                    if (hook === 'beforeAll') {
                        await TestLifecycleListeners.emitWillRunBeforeAll()
                    } else if (hook === 'afterAll') {
                        await TestLifecycleListeners.emitWillRunAfterAll()
                    }

                    if (SpruceTestResolver.ActiveTestClass) {
                        await cb.apply(Target.constructor)
                    } else {
                        await cb.apply(Target)
                    }

                    if (hook === 'beforeAll') {
                        await TestLifecycleListeners.emitDidRunBeforeAll()
                    } else if (hook === 'afterAll') {
                        await TestLifecycleListeners.emitDidRunAfterAll()
                    }
                }
            })
        }
    })
}

async function runAfterEach(Target: any) {
    await SpruceTestResolver.resolveTestClass(Target).afterEach()
}

async function runBeforeEach(Target: any) {
    await SpruceTestResolver.resolveTestClass(Target).beforeEach()
}

/** Test decorator */
export default function test(description?: string, ...args: any[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        hookupTestClassToJestLifecycle(target)

        // Make sure each test gets the spruce
        it(description ?? propertyKey, async () => {
            const testClass = SpruceTestResolver.resolveTestClass(target)
            const bound = descriptor.value.bind(testClass)

            //@ts-ignore
            global.activeTest = {
                file: target.name,
                test: propertyKey,
            }
            return bound(...args)
        })
    }
}

export function suite() {
    return function (Target: any) {
        SpruceTestResolver.ActiveTestClass = Target
    }
}

/** Only decorator */
test.only = (description?: string, ...args: any[]) => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Lets attach before/after
        hookupTestClassToJestLifecycle(target)

        // Make sure each test gets the spruce
        it.only(description ?? propertyKey, async () => {
            const bound = descriptor.value.bind(
                SpruceTestResolver.resolveTestClass(target)
            )
            return bound(...args)
        })
    }
}

/** Todo decorator */
test.todo = (description?: string, ..._args: any[]) => {
    return function (target: any, propertyKey: string) {
        // Lets attach before/after
        hookupTestClassToJestLifecycle(target)

        // Make sure each test gets the spruce
        it.todo(description ?? propertyKey)
    }
}

/** Skip decorator */
test.skip = (description?: string, ...args: any[]) => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Lets attach before/after
        hookupTestClassToJestLifecycle(target)

        // Make sure each test gets the spruce
        it.skip(description ?? propertyKey, async () => {
            const bound = descriptor.value.bind(
                SpruceTestResolver.resolveTestClass(target)
            )
            return bound(...args)
        })
    }
}
