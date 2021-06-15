const express = require('express')
const router = express.Router()

const Auth = require('../middlewares/Auth')
const { promoCodeLimit, transferItems } = require('../middlewares/rateLimit')

const UserController = require('../controllers/UserController')
const InventoryController = require('../controllers/InventoryController')
const PromocodeController = require('../controllers/PromocodeController')
const ItemsController = require('../controllers/ItemsController')
const GameAccountController = require('../controllers/GameAccountController')
const CharsControlle = require('../controllers/CharsControlle')



//Auth
router.post('/signup', UserController.signup)
router.post('/signin', UserController.sign)

//User
router.get('/user/info', Auth, UserController.info)

//Promocode
router.post('/promocode/add', Auth, PromocodeController.create)
router.post('/promocode/redeem', Auth, promoCodeLimit, PromocodeController.redeem)

//Inventory
router.get('/inventory/get_items', InventoryController.list)

//Items
router.get('/items/get_list', ItemsController.getItemsList)
router.post('/chars/transfer', Auth, ItemsController.transferItems)

//Account
router.post('/game_account/create', Auth, GameAccountController.createAccount)

//Chars
router.get('/chars/list', Auth, CharsControlle.getList)

module.exports = router