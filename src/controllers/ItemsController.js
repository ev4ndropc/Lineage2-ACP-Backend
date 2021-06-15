const database = require('../database/mysql')
const moment = require('moment')
moment.locale('pt')

module.exports = {
    async getItemsList(request, response) {
        const items = await database.select().table('items_icons')

        return response.status(200).json({ ok: true, items, ip: request.ip })
    },

    async getItem(request, response) {
        const { item_id } = request.query

        const item = await database.select().where({ icon_item_id: item_id }).table('items_icons')
        
        return response.status(200).json({ ok: true, item })

    },
    async transferItems(request, response) {
        const { items } = request.body
        const { char_from, char_to } = request.query
        
        if(items == '' || items == undefined || char_from == '' || char_to == '')
        return response.status(400).json({ ok:false,  message: 'Incorrect parameters, error in the request.' })
    
        var check_char_from = await database.select().table('characters').join('accounts').where({ 'characters.char_name': char_from , 'accounts.email': request.email}).first()
        var check_char_to = await database.select().table('characters').join('accounts').where({ 'characters.char_name': char_to, 'accounts.email': request.email}).first()
    
    
        if(check_char_from == '' || check_char_to == '')
        return response.status(400).json({ ok:false,  message: 'The selected characters do not exist.' })
    
        if(check_char_from.online == 1 || check_char_to.online == 1)
        return response.status(400).json({ ok:false,  message: 'Both characters need to be offline for at least 1 minute in order to transfer the items.' })

    
        try {

          items.forEach(async item => {
            await database.update({ owner_id: check_char_to.obj_Id }).where({ owner_id: check_char_from.obj_Id, object_id: item.object_id }).table('items')
          })
          return response.status(200).json({ ok:true, message: 'Items successfully transferred.' })
        } catch (error) {    
          return response.status(400).json({ ok:false, message: 'Error transferring items, contact administrator.' })
        }
    
      }
}