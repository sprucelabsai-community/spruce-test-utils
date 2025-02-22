if (typeof it === 'undefined') {
    //@ts-ignore
    global.it = () => {}
}

type TestLifecycleListener = () => any | Promise<any>
type TestLifecycleListenerWithTest = (Test: any) => any | Promise<any>

export class TestLifecycleListeners {
    public static beforeBeforeAll: TestLifecycleListener[] = []
    public static afterBeforeAll: TestLifecycleListener[] = []
    public static beforeAfterAll: TestLifecycleListener[] = []
    public static afterAfterAll: TestLifecycleListener[] = []

    public static beforeBeforeEach: TestLifecycleListenerWithTest[] = []
    public static afterBeforeEach: TestLifecycleListenerWithTest[] = []
    public static beforeAfterEach: TestLifecycleListenerWithTest[] = []
    public static afterAfterEach: TestLifecycleListenerWithTest[] = []

    public static async runWillBeforeAll() {
        for (const cb of this.beforeBeforeAll) {
            await cb()
        }
    }

    public static async runAfterBeforeAll() {
        for (const cb of this.afterBeforeAll) {
            await cb()
        }
    }

    public static async runBeforeEach() {
        for (const cb of this.beforeBeforeEach) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async runAfterBeforeEach() {
        for (const cb of this.afterBeforeEach) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async runBeforeAfterEach() {
        for (const cb of this.beforeAfterEach) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async runAfterAfterEach() {
        for (const cb of this.afterAfterEach) {
            await cb(SpruceTestResolver.getActiveTest())
        }
    }

    public static async runBeforeAfterAll() {
        for (const cb of this.beforeAfterAll) {
            await cb()
        }
    }

    public static async runAfterAfterAll() {
        for (const cb of this.afterAfterAll) {
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

    public static onWillBeforeAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.beforeBeforeAll.push(cb)
    }

    public static onAfterBeforeAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.afterBeforeAll.push(cb)
    }

    public static onBeforeBeforeEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.beforeBeforeEach.push(cb)
    }

    public static onAfterBeforeEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.afterBeforeEach.push(cb)
    }

    public static onBeforeAfterEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.beforeAfterEach.push(cb)
    }

    public static onAfterAfterEach(cb: TestLifecycleListenerWithTest) {
        TestLifecycleListeners.afterAfterEach.push(cb)
    }

    public static onBeforeAfterAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.beforeAfterAll.push(cb)
    }

    public static onAfterAfterAll(cb: TestLifecycleListener) {
        TestLifecycleListeners.afterAfterAll.push(cb)
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
                    await TestLifecycleListeners.runBeforeEach()
                    await runBeforeEach(Target)
                    await TestLifecycleListeners.runAfterBeforeEach()
                } else if (hook === 'afterEach') {
                    await TestLifecycleListeners.runBeforeAfterEach()
                    await runAfterEach(Target)
                    await TestLifecycleListeners.runAfterAfterEach()

                    // @ts-ignore
                    delete SpruceTestResolver.__activeTest
                } else {
                    if (hook === 'beforeAll') {
                        await TestLifecycleListeners.runWillBeforeAll()
                    } else if (hook === 'afterAll') {
                        await TestLifecycleListeners.runBeforeAfterAll()
                    }

                    if (SpruceTestResolver.ActiveTestClass) {
                        await cb.apply(Target.constructor)
                    } else {
                        await cb.apply(Target)
                    }

                    if (hook === 'beforeAll') {
                        await TestLifecycleListeners.runAfterBeforeAll()
                    } else if (hook === 'afterAll') {
                        await TestLifecycleListeners.runAfterAfterAll()
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
