export interface UserDto {
    id: number;
    name?: string;
    email: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
