import { Router, Request, Response } from 'express'

import * as userController from '../controllers/user'
import { CreateUserDTO, FilterUsersDTO, UpdateUserDTO } from '../dto/user.dto'

const usersRouter = Router()

usersRouter.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    const result = await userController.getById(id)
    return res.status(200).send(result)
})

usersRouter.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const payload: UpdateUserDTO = req.body

    const result = await userController.update(id, payload)
    return res.status(201).send(result)
})

usersRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    const result = await userController.deleteById(id)
    return res.status(204).send({
        success: result
    })
})

usersRouter.post('/', async (req: Request, res: Response) => {
    const payload: CreateUserDTO = req.body

    const result = await userController.create(payload)
    return res.status(200).send(result)
})

usersRouter.get('/', async (req: Request, res: Response) => {
    const filters: FilterUsersDTO = req.query

    const results = await userController.getAll(filters)
    return res.status(200).send(results)
})

export default usersRouter