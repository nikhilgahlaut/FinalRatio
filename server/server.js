const app = require('./app')

PORT = process.env.PORT || 8000

app.listen(PORT,(req,res)=>{
    console.log(`server connected at : ${PORT}`);
})