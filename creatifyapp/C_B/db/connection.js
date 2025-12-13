const mongoose =require('mongoose');
const db ='mongodb+srv://abhishek-verma:Nis.12341234@cluster0.aagekjb.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true

}).then(()=>{
     console.log('database connected successfully');
}).catch((e)=>{
     console.log(e,'<=error');
})