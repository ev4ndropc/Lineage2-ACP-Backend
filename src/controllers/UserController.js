const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const moment = require('moment')
moment.locale('pt')

const mongoose = require('../database/mongo')
const User = require('../schema/User')
const ReferredFriends = require('../schema/ReferredFriend')

const database = require('../database/mysql')

const { genRandomString, genRandomNumber} = require('../util/recruitFriendId')

function generateToken(params = {} ) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400,
  })
}

module.exports = {
  async signup(request, response) {
    const {  email, password, recruitId, ip } = request.body

    if( !email || !password )
    return response.status(404).json({ ok: false, message: 'Please fill in all fields and try again.' })

    if( email.trim() == '' || password.trim() == '' )
    return response.status(404).json({ ok: false, message: 'Please fill in all fields and try again.' })


    const user = await User.findOne({ email });

    if(user)
    return response.status(404).json({ ok: false, message: 'There is already a registered user with this email.' })

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      email,
      password: hash,
      is_admin: false,
      banned: false,
      is_active: false,
      balance: 0,
      recruit_friend_id: genRandomString(2)+genRandomNumber(5),
      created_at: moment().format(),
      token: uuid(),
      ip
    })

    if(recruitId){
      const user_referred = await User.findOne({ recruit_friend_id: recruitId })


      if(user_referred){
        await ReferredFriends.create({ 
          account_id: user_referred._id, 
          referred_id: newUser._id ,
          created_at: newUser.created_at
        })
      }
    }

    return response.status(200).json({ ok: true, message: 'Account created successfully, be very welcome!', session_token: generateToken({ _id: newUser._id }) })

  },
  async sign(request, response) {
    const { email, password } = request.body

    if(!email, !password)
    return response.status(404).json({ ok: false, message: 'Sent all require data. (email, password)' })

    if( email.trim() == '' || password.trim() == '' )
    return response.status(404).json({ ok: false, message: 'Please fill in all fields and try again.' })


    const user = await User.findOne({ email })

    if(!user)
    return response.status(404).json({ ok: false, message: 'There is no user registered with this username or password.' })

    if(user.banned)
    return response.status(404).json({ ok: false, message: 'Your account has been temporarily banned!.' })

    const correct = bcrypt.compareSync(password, user.password);

    if(!correct)
    return response.status(404).json({ ok: false, message: 'There is no user registered with this username or password.' })


    if(user.is_active) {
      return response.status(200).json({ 
        ok: true, 
        name: user.name, 
        message: 'Username successfully, wait while we redirect you!', 
        session_token: generateToken({ _id: user._id, email: user.email }) 
      })
    }else{
      return response.status(200).json({ ok: true, need_to_activate: true, name: user.name, number: user.number })
    }


  },

  async activeAccount(request, response) {
    const { active_code, email } = request.body

    if(!active_code, !email)
    return response.status(404).json({ ok: false, message: 'Please fill in all fields and try again.' })

    if( active_code.trim() == '' || email.trim() == '' )
    return response.status(404).json({ ok: false, message: 'Please fill in all fields and try again.' })


    const user = await User.findOne({ email })

    if(!user)
    return response.status(404).json({ ok: false, message: 'Please fill in all fields and try again.' })


    if(active_code == user.active_code) {
      await User.updateOne({email}, { is_active: true }, (r) => console.log(r))

      return response.status(200).json({ 
        ok: true, 
        name: user.name,  
        message: 'Account successfully activated!',
        session_token: generateToken({ _id: user._id, email: user.email }) 
      })
    }else{
      return response.status(400).json({ ok: false, message: 'Invalid activation code, try again!'}) 
    }
  },

  async forgot(request, response) {
    
  },
  async reset(request, response) {
    
  },
  async info(request, response) {
    const user = await User.findOne({ _id: request._id })
    .select("-password")
    .select("-token")
    .select("-is_admin")

    const game_infos = await database.select('login', 'email', 'lastactive', 'created_at', 'obj_Id', 'char_name', 'level', 'online', 'lastAccess', 'onlineTime', 'race', 'sex', 'base_class')
    .where({ email: user.email })
    .table('accounts')
    .innerJoin('characters')


    var chars = []
    var accounts = []

    game_infos.forEach(data => {
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

      accounts.push({
        email: data.email,
        login: data.login,
        lastactive: data.lastactive,
        created_at: data.created_at
      })
    })

    accounts = accounts.filter((v,i,a)=>a.findIndex(t=>(t.login === v.login))===i)
    chars = chars.filter((v,i,a)=>a.findIndex(t=>(t.char_name === v.char_name))===i)

    return response.status(200).json({ user, ip: request.ip, chars, accounts })
  }
}
