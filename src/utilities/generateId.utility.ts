import crypto from 'crypto'

export default function generateId() {
    return crypto.randomUUID().replace(/[^a-z0-9]/gi, '')
}
