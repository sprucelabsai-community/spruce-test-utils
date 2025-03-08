import SpruceTestResolver, {
    TestLifecycleListeners,
} from './SpruceTestResolver'

if (typeof it === 'undefined') {
    //@ts-ignore
    global.it = () => {}
}

let areLifecycleHooksInPlace = false

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
function hookupTestClassToJestLifecycle(Target: any) {
    if (areLifecycleHooksInPlace) {
        return
    }

    areLifecycleHooksInPlace = true
    const hooks = ['beforeAll', 'beforeEach', 'afterAll', 'afterEach']
    hooks.forEach((hook) => {
        // @ts-ignore
        if (global[hook]) {
            // @ts-ignore
            global[hook](async () => {
                SpruceTestResolver.resolveTestClass(Target)
                if (hook === 'beforeEach') {
                    await TestLifecycleListeners.emitWillRunBeforeEach()
                    await runBeforeEach(Target)
                    await TestLifecycleListeners.emitDidRunBeforeEach()
                } else if (hook === 'afterEach') {
                    await TestLifecycleListeners.emitWillRunAfterEach()
                    await runAfterEach(Target)
                    await TestLifecycleListeners.emitDidRunAfterEach()
                    SpruceTestResolver.reset()
                } else if (hook === 'beforeAll') {
                    await TestLifecycleListeners.emitWillRunBeforeAll()
                    await runBeforeAll(Target)
                    await TestLifecycleListeners.emitDidRunBeforeAll()
                    SpruceTestResolver.reset()
                } else if (hook === 'afterAll') {
                    await TestLifecycleListeners.emitWillRunAfterAll()
                    await runAfterAll(Target)
                    await TestLifecycleListeners.emitDidRunAfterAll()
                }
            })
        }
    })
}

async function runBeforeAll(Target: any) {
    await callStaticHook(Target, 'beforeAll')
}

async function runAfterAll(Target: any) {
    await callStaticHook(Target, 'afterAll')
}

async function callStaticHook(Target: any, hook: 'beforeAll' | 'afterAll') {
    const cb = resolveMethod(Target, hook)
    await cb?.apply?.(
        SpruceTestResolver.ActiveTestClass ? Target.constructor : Target
    )
}

async function runAfterEach(Target: any) {
    if (SpruceTestResolver.ActiveTestClass) {
        const Resolved = SpruceTestResolver.resolveTestClass(Target)
        await Resolved.afterEach?.apply(Resolved)
    } else if (Target.afterEach) {
        await Target.afterEach?.apply?.(Target)
    } else {
        await Target?.constructor.afterEach?.apply?.(Target.constructor)
    }
}

async function runBeforeEach(Target: any) {
    if (SpruceTestResolver.ActiveTestClass) {
        const Resolved = SpruceTestResolver.resolveTestClass(Target)
        await Resolved.beforeEach?.apply(Resolved)
    } else if (Target.beforeEach) {
        await Target.beforeEach?.apply?.(Target)
    } else {
        await Target?.constructor.beforeEach?.apply?.(Target.constructor)
    }
}

/** Test decorator */
export default function test(description?: string, ...args: any[]) {
    return function (
        Target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        hookupTestClassToJestLifecycle(Target)

        // Make sure each test gets the spruce
        it(description ?? propertyKey, async () => {
            const Resolved = SpruceTestResolver.resolveTestClass(Target)

            if (!Resolved[propertyKey]) {
                throw new Error(
                    `The test '${propertyKey}()' should NOT be static when tests run with suite()`
                )
            }

            const bound = descriptor.value.bind(Resolved)

            //@ts-ignore
            global.activeTest = {
                file: Target.name,
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
