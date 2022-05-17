import {User} from "../users/models";

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV !== 'test'

const dbInit = () => {
    User.sync({ alter: isDev || isTest })
}

export default dbInit 