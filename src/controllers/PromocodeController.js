const moment = require('moment')
moment.locale('pt')

const Promocode = require('../schema/Promocode');
const RedeemedCode = require('../schema/RedeemedCode')
const User = require('../schema/User');

module.exports =  {
  async create(request, response) {
    const { type, valid_at, promocode, value, quantity, promote } = request.body

    if(!type || !valid_at || !promocode || !quantity)
    return response.status(400).json({ ok: false, message: 'Invalid request, sent all require fields.' })

    const user = await User.findOne({ _id: request._id })

    if(!user.is_admin)
    return response.status(400).json({ ok: false, message: 'Invalid request, you are not an administrator.' })

    const hasCodeCreated = await Promocode.findOne({ promocode })

    if(hasCodeCreated){
      if(hasCodeCreated.status == 'active')
      return response.status(400).json({ ok: false, message: 'The code entered is already active.' })
    } 

    await Promocode.create({
      account_id: user._id, 
      promocode,
      type,
      value,
      status: 'active',
      promote,
      quantity,
      valid_at,
      created_at: moment().format(),
    })

    return response.status(200).json({ ok: true, message: 'Cupom code created successfuly.' })
  },
  async redeem(request, response) {
    const { redeemCode } = request.body

    var today = moment().format()

    if(!redeemCode)
    return response.status(400).json({ ok: false, message: 'Please, sent redeem code.' })

    const check_code = await Promocode.findOne({ promocode: redeemCode })
    const hasRedeem = await RedeemedCode.findOne({ account_id: request._id, redeemcode: redeemCode })

    if(!check_code)
    return response.status(400).json({ ok: false, message: 'This code is no longer available.' })

    if(hasRedeem)
    return response.status(400).json({ ok: false, message: 'You have already redeemed this code.' })

    if(check_code.status == 'disabled')
    return response.status(400).json({ ok: false, message: 'This code is no longer available.' })

    if(check_code.valid_at > today)
    return response.status(400).json({ ok: false, message: 'This code is no longer available.' })

    if(check_code.quantity <= 0)
    return response.status(400).json({ ok: false, message: 'This code is no longer available.' })

    if(check_code.type == 'balance'){

      const user = await User.findOne({ _id: request._id })
      await User.updateOne({ _id: request._id }, { balance: Number(user.balance)+Number(check_code.value) })

      await Promocode.updateOne({ promocode: redeemCode }, { quantity:Number(check_code.quantity)-1 } )
      await RedeemedCode.create({ account_id: request._id, redeemcode: redeemCode  })

      return response.status(200).json({ ok: true, message: 'Coupon successfully applied!' })
    
    }
    

  } 
}