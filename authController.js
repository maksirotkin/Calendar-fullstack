const User = require('./models/User');
const app=require('./index')
const dayEvents = require('./models/dayEvents');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');//експортуємо функцію для отрмання помилок під час валідації
const session = require('express-session');//Робимо сесію для поточного користувача, щоб витягувати події як належать йому


class authController{
    
    async registration(req,res ){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {//якщо є помилки то виводимо їх
                console.log(`Помилка при Реєстрації`);
                return res.status(400).json(`Помилка при Реєстрації`)
            }
            //витягуємо з поточного запросу
            const {username, password} = req.body;
            //кандидат провіряє чи є користувач з таким імям
            const candidate = await User.findOne({username});
            if (candidate) {
                console.log(`Користувач з таким ім'ям вже існує`);
                return res.status(400).json(`Користувач з таким ім'ям вже існує`);
                console.loge()
            }
            //хешируємо пароль
            const hashPassword = bcrypt.hashSync(password, 4);
            //створюєм новго користувача
            const user=new User({username,password:hashPassword});
            user.save();
            
           // this.currentUser(user);
           console.log(`Користувач зареєстрований`);
            return res.json(`Користувач зареєстрований`);

        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }

    }
    async login(req,res){
        try{            
            const {username, password} = req.body;        
            const user = await User.findOne({username});//провіряємо чи є в базі даних такий користувач
            if (!user) {
                return res.status(400).json(`Користувач не знайдений`)
            }
            const validPassword = bcrypt.compareSync(password,user.password);
            if (!validPassword) {

                return res.status(400).json(`Введений пароль невірний`)
            }
            session.username=user.username;    
            return res.json(`Успішний вхід ${user.username}`);

        }catch(e){
            console.log(e)
            res.status(400).json({message: `Login errorCurrrent session id ${session.id}`})      
        }
    }
    async addayEvents(req,res){
        try{         
        if(!session.username){            
            return res.json(`Поточний користувач невідомий`);
        }  
        const user = await User.findOne({username:session.username})           
        let eventArr=[];
        eventArr=req.body;
        await dayEvents.deleteMany({userid:user});

        if (eventArr.length > 0) {
            //await dayEvents.deleteMany({userid:user});
      
            for (const item of eventArr) {
              const existingEvent = await dayEvents.findOne({
                day: item.day,
                month: item.month,
                year: item.year,
                events: item.events,
                userid: user.id,
              });
      
              if (!existingEvent) {
                const event = new dayEvents({
                  day: item.day,
                  month: item.month,
                  year: item.year,
                  events: item.events,
                  userid: user.id,
                });
      
                await event.save();
              }
            }
          }
          return res.json(`Користувач ${user.username} Загрузив події`);
        }catch(e){
            console.log(e)
          return res.status(400).json( `Помилка при додавані подій, поточний користувач: ${session.username}`)
        }
    }

    async getdayEvents(req,res){
        try{
            if(!session.username){            
                return res.json({message:` ${session.username}`});
            }    
            const user = await User.findOne({username:session.username})
           const events = await dayEvents.find({userid:user});
           //const events = await dayEvents.find();  
           return res.json(events);
        }catch(e){
            console.log(e)
            return res.json(`errrr0r`);
        }
    } 
    async getUsers(req,res){
        try{   
            const users = await User.find()
           res.json(users)
    
        }catch(e){
            console.log(e);
        }
    }
    async getUser(req,res){
        try{   
            if(!session.username){                
                return res.json({message:`Користувач ${(session.username)} не знайдений`});
            }
            const user = await User.findOne({username:(session.username)})
             //await dayEvents.deleteMany({userid:user});
            return res.json(user);
        }catch(e){
            console.log(e)
            res.status(400).json(undefined)
        }
    } 
    async DeleteEvents(req,res){
        try{
            if(!session.username){            
                return res.json({message:` ${session.username}`});
            }    
            const user = await User.findOne({username:session.username})
             await dayEvents.deleteMany({userid:user});        
        
        }catch(e){
            console.log(e);

        }
    } 
}
module.exports = new authController()



