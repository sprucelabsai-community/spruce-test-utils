import StackCleaner from './StackCleaner'

export default class AssertionError extends Error {
    public constructor(message: string, stack?: string) {
        super(message)
        this.message = message
        this.stack = StackCleaner.clean(
            `${this.message}${(stack ?? this.stack ?? '').replace(message, '')}`
        )
    }
}
