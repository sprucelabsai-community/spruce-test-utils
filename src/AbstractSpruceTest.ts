import path from 'path'

export default class AbstractSpruceTest {
    public static cwd: string

    protected static async beforeAll() {
        this.cwd = process.cwd()
    }

    protected static async afterAll() {}
    protected static async beforeEach() {}
    protected static async afterEach() {}

    protected static resolvePath(...filePath: string[]) {
        const cwd = this.cwd
        let builtPath = path.join(...filePath)

        if (!cwd) {
            throw new Error('You must call super.beforeAll().')
        }

        if (builtPath[0] !== '/') {
            if (builtPath.substr(0, 2) === './') {
                builtPath = builtPath.substr(1)
            }

            builtPath = path.join(cwd, builtPath)
        }

        return builtPath
    }

    protected static async wait(ms = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), ms)
        })
    }

    protected static log(...args: any[]) {
        const str = args.map((a) => `${a}`).join(' ')
        process.stderr.write(str)
    }

    //instance declariations
    public cwd = process.cwd()

    protected async wait(ms = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), ms)
        })
    }

    protected log(...args: any[]) {
        const str = args.map((a) => `${a}`).join(' ')
        process.stderr.write(str)
    }

    protected resolvePath(...filePath: string[]) {
        const cwd = this.cwd
        let builtPath = path.join(...filePath)

        if (builtPath[0] !== '/') {
            if (builtPath.substr(0, 2) === './') {
                builtPath = builtPath.substr(1)
            }

            builtPath = path.join(cwd, builtPath)
        }

        return builtPath
    }

    protected async beforeEach() {}
    protected async afterEach() {}
}
