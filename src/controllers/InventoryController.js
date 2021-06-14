const database = require('../database/mysql')
const Item = require('../schema/Item')

const items = require('../../data.json')

module.exports = {
  async list(request, response) {
    const { char_name } = request.query
    
    try {
      const char_items = await database.
        select('account_name', 'char_name', 'obj_id', 'object_id', 'item_id', 'count', 'enchant_level', 'icon_item_id', 'description', 'grade', 'name', 'icon_name')
        .where({ char_name })
        .table('characters')
        .join('items', 'owner_id', '=', 'characters.obj_id')
        .join('items_icons', 'icon_item_id', '=', 'items.item_id')
        .orderBy('time', 'asc')
        
      return response.status(200).json({ ok: true, char_items })
    } catch (error) {
      console.log(error)
      return response.status(200).json({ ok: false })
    }
  }
}
