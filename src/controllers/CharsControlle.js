const database = require('../database/mysql')
const moment = require('moment')
moment.locale('pt')

module.exports = {
    async getList(request, response) {
        const { login } = request.query

        const chars_info = await database.select().table('accounts').where({ email: request.email }).join('characters').where({ account_name: login })//.table('characters')

        var chars = []
    
        chars_info.forEach(data => {
          chars.push({
            base_class: data.base_class,
            char_name: data.char_name,
            lastAccess: data.lastAccess,
            level: data.level,
            obj_Id: data.obj_Id,
            online: data.online,
            onlineTime: moment(Number(data.onlineTime)).format('LLL'),
            race: data.race,
            sex: data.sex,
          })
        })
    
        chars = chars.filter((v,i,a)=>a.findIndex(t=>(t.char_name === v.char_name))===i)

        return response.status(200).json({ ok: true, chars })
    }
}