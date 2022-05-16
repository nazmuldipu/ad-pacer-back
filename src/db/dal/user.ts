import { Op } from 'sequelize'
import { isEmpty } from 'lodash'

import { User } from '../models'
import { GetAllUsersFilters } from './types'
import { UserInput, UserOutput } from '../models/User'

export const create = async (payload: UserInput): Promise<UserOutput> => {
    const ingredient = await User.create(payload)

    return ingredient
}

export const findOrCreate = async (payload: UserInput): Promise<UserOutput> => {
    const [ingredient] = await User.findOrCreate({
        where: {
            name: payload.name
        },
        defaults: payload
    })

    return ingredient
}

export const update = async (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
    const ingredient = await User.findByPk(id)

    if (!ingredient) {
        // @todo throw custom error
        throw new Error('not found')
    }

    const updatedUser = await ingredient.update(payload)
    return updatedUser
}

export const getById = async (id: number): Promise<UserOutput> => {
    const ingredient = await User.findByPk(id)

    if (!ingredient) {
        // @todo throw custom error
        throw new Error('not found')
    }

    return ingredient
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedUserCount = await User.destroy({
        where: { id }
    })

    return !!deletedUserCount
}

export const getAll = async (filters?: GetAllUsersFilters): Promise<UserOutput[]> => {
    return User.findAll({
        where: {
            ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } })
        },
        ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true })
    })
}

export const checkSlugExists = async (email: string): Promise<boolean> => {
    const ingredientWithSlug = await User.findOne({
        where: {
            email
        }
    });

    return !isEmpty(ingredientWithSlug)
}