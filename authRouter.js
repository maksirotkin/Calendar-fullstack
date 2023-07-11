const Router = require('express')
const router = new Router()
const controller=require('./authController')
const {check}= require("express-validator")//експортуємо функцію chek для нашої валідації

router.post('/registration',[
    check('username',"Ім'я користувача не може бути пустим").notEmpty(),
    check('password',"Пароль має бути не менше 4 символів").isLength({min:4})
    ],controller.registration
    )
router.post('/login',controller.login)
 router.get('/users',controller.getUsers)
 router.get('/events',controller.getdayEvents)
 router.get('/user',controller.getUser)
 router.get('/deleteEvents',controller.DeleteEvents)
 router.post('/addEvents',controller.addayEvents)

module.exports = router