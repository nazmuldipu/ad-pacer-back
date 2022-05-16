import { Optional } from "sequelize/types"

export type CreateUserDTO = {
    name: string;
    slug?: string;
    description?: string;
    foodGroup?: string;
}

export type UpdateUserDTO = Optional<CreateUserDTO, 'name'>

export type FilterUsersDTO = {
    isDeleted?: boolean
    includeDeleted?: boolean
}