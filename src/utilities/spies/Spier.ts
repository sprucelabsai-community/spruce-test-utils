import Spy from './Spy'

export default class Spier {
    private static spyInstances: Spy<any, any>[] = []

    public static Spier() {
        for (const spy of Spier.spyInstances) {
            spy.reset()
        }

        Spier.spyInstances = []

        return new Spier()
    }

    public spy<T extends Record<string, any>>(object: T, method: keyof T) {
        if (!object) {
            throw new Error('You must pass a function to spy on')
        }

        const spy = new Spy(object, method)

        Spier.spyInstances.push(spy)

        return spy
    }
}
