require('dotenv').config()
const PORT = process.env.PORT
const app = require('./app')
require('./db/db')()

app.listen(PORT, ()=>{

   
    console.log(`Server Running On Port ${PORT}`);
})