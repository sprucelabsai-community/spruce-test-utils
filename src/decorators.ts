if (typeof it === 'undefined') {
    //@ts-ignore
    global.it = () => {}
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
                    await SpruceTestResolver.resolveTestClass(
                        Target
                    ).beforeEach()
                } else if (hook === 'afterEach') {
                    await SpruceTestResolver.resolveTestClass(
                        Target
                    ).afterEach()
                    // @ts-ignore
                    delete SpruceTestResolver.__activeTest
                } else {
                    if (SpruceTestResolver.ActiveTestClass) {
                        await cb.apply(Target.constructor)
                    } else {
                        await cb.apply(Target)
                    }
                }
            })
        }
    })
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
