import * as service from '../../../db/services/UserService'
import { CreateUserDTO, UpdateUserDTO, FilterUsersDTO } from '../../dto/user.dto'
import { User } from '../../interfaces'
import * as mapper from './mapper'

export const create = async (payload: CreateUserDTO): Promise<User> => {
    return mapper.toUser(await service.create(payload))
}

export const update = async (id: number, payload: UpdateUserDTO): Promise<User> => {
    return mapper.toUser(await service.update(id, payload))
}

export const getById = async (id: number): Promise<User> => {
    return mapper.toUser(await service.getById(id))
}

export const deleteById = async (id: number): Promise<Boolean> => {
    const isDeleted = await service.deleteById(id)

    return isDeleted
}

export const getAll = async (filters: FilterUsersDTO): Promise<User[]> => {
    return (await service.getAll(filters)).map(mapper.toUser)
}