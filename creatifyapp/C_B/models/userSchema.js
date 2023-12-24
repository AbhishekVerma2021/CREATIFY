const mongoose= require('mongoose');

const followers = new mongoose.Schema({
    uId: String,
    username: String,
    email: String,
});

const following = new mongoose.Schema({
    uId: String,
    username: String,
    email: String,
});
const favourites = new mongoose.Schema({
    uId: String,
    username: String,
    email: String,
});
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    followers: [followers],
    following: [following],
    favourites: [favourites],
    date: {
        type: Date,
        default: Date.now,
    },
})
const Users= new mongoose.model("USER",userSchema);
module.exports=Users;