const moment = require('moment')
moment.locale('pt')

const Password = require('../util/Password')

const database = require('../database/mysql')

module.exports = {
    async createAccount(request, response) {
        const { login, password } = request.body

        try {
            const hasLogin = await database.select().where({ login }).table('accounts').first()

            if(hasLogin)
            return response.status(400).json({ ok: false, message: 'There is already an account registered with this login.' })

            const accountsNumber = await database.select().where({ email: request.email }).table('accounts')

            if(accountsNumber.length >= 5 )
            return response.status(400).json({ ok: false, message: 'You have already created the maximum number of accounts allowed.' })

            await database.insert({ login, password: Password(password), email: request.email, created_at: moment().unix()*1000 }).into('accounts')
            return response.status(200).json({ ok: true, message: 'Account created successfully!' })
        } catch (error) {
            console.log(error)
            return response.status(400).json({ ok: false, message: 'There was an error creating your account, please try again later.' })

        }

    }
}