if (typeof it === 'undefined') {
    //@ts-ignore
    global.it = () => {}
}

export class SpruceTestDecoratorResolver {
    public static ActiveTestClass?: any
    private static __activeTest: any

    public static resolveActiveTest(target: any) {
        this.__activeTest = this.ActiveTestClass
            ? new this.ActiveTestClass()
            : target
        return this.__activeTest
    }

    public static getActiveTest() {
        return this.__activeTest
    }
}

/** Hooks up before, after, etc. */
function hookupTestClass(target: any, h?: string[]) {
    if (target.__isTestingHookedUp) {
        return
    }
    target.__isTestingHookedUp = !h
    const hooks = h ?? ['beforeAll', 'beforeEach', 'afterAll', 'afterEach']
    hooks.forEach((hook) => {
        // Have they defined a hook
        if (!target[hook]) {
            return
        }

        if (
            SpruceTestDecoratorResolver.ActiveTestClass &&
            !h &&
            hook === 'beforeAll'
        ) {
            throw new Error(`beforeAll() and afterAll() must be static`)
        }

        // @ts-ignore
        if (global[hook]) {
            // @ts-ignore
            global[hook](async () => {
                if (hook === 'afterAll') {
                    //@ts-ignore
                    SpruceTestDecoratorResolver.__activeTest = null
                }
                return target[hook]()
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
        // Lets attach before/after
        hookupTestClass(target)

        // Make sure each test gets the spruce
        it(description ?? propertyKey, async () => {
            const testClass =
                SpruceTestDecoratorResolver.resolveActiveTest(target)
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
        SpruceTestDecoratorResolver.ActiveTestClass = Target
        // Test.activeTest.__isTestingHookedUp = false
        hookupTestClass(Target, ['beforeAll', 'afterAll'])
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
        hookupTestClass(target)

        // Make sure each test gets the spruce
        it.only(description ?? propertyKey, async () => {
            const bound = descriptor.value.bind(
                SpruceTestDecoratorResolver.resolveActiveTest(target)
            )
            return bound(...args)
        })
    }
}

/** Todo decorator */
test.todo = (description?: string, ..._args: any[]) => {
    return function (target: any, propertyKey: string) {
        // Lets attach before/after
        hookupTestClass(target)

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
        hookupTestClass(target)

        // Make sure each test gets the spruce
        it.skip(description ?? propertyKey, async () => {
            const bound = descriptor.value.bind(
                SpruceTestDecoratorResolver.resolveActiveTest(target)
            )
            return bound(...args)
        })
    }
}
