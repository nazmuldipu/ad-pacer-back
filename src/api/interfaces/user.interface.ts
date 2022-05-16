export interface User {
    id: number
    name: string
    email: string
    password?: string
    permissionLevel?: number
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}