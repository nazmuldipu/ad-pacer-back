import * as UserDal from '../dal/user'
import {GetAllUsersFilters} from '../dal/types'
import {UserInput, UserOutput} from '../models/User'

export const create = async (payload: UserInput): Promise<UserOutput> => {
    let email = payload.email;
    const emailExists = await UserDal.checkSlugExists(email)

    payload.email = emailExists ? `${email}-${Math.floor(Math.random() * 1000)}` : email
    
    return UserDal.create(payload)
}

export const update = async (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
    if (payload.name) {
        let email =payload.name
        const emailExists = await UserDal.checkSlugExists(email)

        payload.email = emailExists ? `${email}-${Math.floor(Math.random() * 1000)}` : email
    }
    
    return UserDal.update(id, payload)
}

export const getById = (id: number): Promise<UserOutput> => {
    return UserDal.getById(id)
}

export const deleteById = (id: number): Promise<boolean> => {
    return UserDal.deleteById(id)
}

export const getAll = (filters: GetAllUsersFilters): Promise<UserOutput[]> => {
    return UserDal.getAll(filters)
}