const express = require('express')
const mongoose=require('mongoose')
const authRouter=require('./authRouter')
const PORT = process.env.PORT || 5000
const session = require('express-session');
const dayEvents = require('./models/dayEvents');
const app = express()
app.use(express.json());
app.use(express.static('Client'));
app.use(express.json())
app.use(authRouter);

  app.use(session({
    secret: '123',
    resave: false,//Параметр resave встановлений на false вказує, що сесія не буде зберігатись у базі даних при кожному запиті до сервера, якщо вона не змінювалась.
    saveUninitialized: false//Це означає, що сесія не буде збережена, якщо вона не була змінена. 
  }))

const start = async ()=>{
    try{
        await mongoose.connect('mongodb+srv://qwerty:qwerty123@atlascluster.ouukhhs.mongodb.net/Calendar')
        app.listen(PORT, () => console.log(`server sterted on PORT: ${PORT}`)) 
          //await dayEvents.deleteMany();
        
    } catch (e){
        console.log(e);
    }
}
start();





