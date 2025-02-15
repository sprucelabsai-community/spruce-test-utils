if (typeof it === 'undefined') {
    //@ts-ignore
    global.it = () => {}
}

class Test {
    public static ActiveTestClass?: any
    public static resolveActiveTest(target: any) {
        return this.ActiveTestClass ? new this.ActiveTestClass() : target
    }
}

/** Hooks up before, after, etc. */
function hookupTestClass(target: any) {
    if (target.__isTestingHookedUp) {
        return
    }
    target.__isTestingHookedUp = true
    const hooks = ['beforeAll', 'beforeEach', 'afterAll', 'afterEach']
    hooks.forEach((hook) => {
        // Have they defined a hook
        if (!target[hook]) {
            return
        }

        // @ts-ignore
        if (global[hook]) {
            // @ts-ignore
            global[hook](async () => {
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
            const testClass = Test.resolveActiveTest(target)
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
        Test.ActiveTestClass = Target
        // Test.activeTest.__isTestingHookedUp = false
        // hookupTestClass(Test.activeTest)
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
            debugger
            const bound = descriptor.value.bind(Test.resolveActiveTest(target))
            debugger
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
            const bound = descriptor.value.bind(Test.resolveActiveTest(target))
            return bound(...args)
        })
    }
}
