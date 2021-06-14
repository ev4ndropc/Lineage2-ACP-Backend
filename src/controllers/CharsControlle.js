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
  },

  async transferItems(request, response) {
    const { items } = request.body
    const { char_from, char_to } = request.query

    var check_char_from = await database.select().table('characters').join('accounts').where({ 'characters.char_name': char_from , 'accounts.email': request.email}).first()
    var check_char_to = await database.select().table('characters').join('accounts').where({ 'characters.char_name': char_to, 'accounts.email': request.email}).first()


    if(check_char_from == '' || check_char_to == '')
    return response.status(400).json({ ok:false,  message: 'The selected characters do not exist.' })

    if(check_char_from.online == 1 || check_char_to.online == 1)
    return response.status(400).json({ ok:false,  message: 'Both characters need to be offline for at least 1 minute in order to transfer the items.' })

    if(items.length == 0)
    return response.status(400).json({ ok:false,  message: 'Select the items you want to transfer.' })

    try {
      items.forEach(async item => {
        await database.update({ owner_id: check_char_to.obj_Id }).where({ owner_id: check_char_from.obj_Id, object_id: item.object_id }).table('items')
      })
      return response.status(200).json({ ok:true, message: 'Items successfully transferred.' })
    } catch (error) {    
      return response.status(400).json({ ok:true, message: 'Error transferring items, contact administrator.' })
    }

  }
}