const database = require('../database/mysql')

module.exports = {
    async getItemsList(request, response) {
        const items = await database.select().table('items_icons')

        return response.status(200).json({ ok: true, items })
    },

    async getItem(request, response) {
        const { item_id } = request.query

        const item = await database.select().where({ icon_item_id: item_id }).table('items_icons')
        
        return response.status(200).json({ ok: true, item })

    }
}