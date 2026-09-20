//user schema

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
//import {use} from "react";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: [true,"Please enter your name"],
            //'       john            '=>'john'
            trim :true,
            maxLength:[50,"Your name cannot be longer than 50 characters"]
        },
        email:{
            type :String,
            required:[true,"Please enter your email"],
            unique : true,
            lowercase:true,
            trim:true,
            validate:[validator.isEmail,"Please enter validate email address"]
        },
        password:{
            type:String,
            required:[true,"Please enter your password"],
            minlength:[6,"Your password must be longer than 6 chareters"],
            select:false
        },
        passwordConfirm:{
            type:String,
            required:[true,"Please confirm your password"],
            validate:{
                validator:function(el){
                    return el === this.password //data type ===
                },
                message:"Password are not the same !"
            }
        },
        phoneNumber:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        avatar:{
            url:{
                type:String
            },
            public_id:{
                type:String
            }
        },
        passwordChangeAt:{
            type:Date,
        },
        passwordResetToken:{
            type:String,
            select:false,
            index:true
        },
        passwordResetExpires:{
            type:Date,
            select:false
        },

    },
    {timestamps:true} //when edit or update user that autosave
)

//settings to not pass in response from server
//doc = documnet and ret = return
userSchema.set("toJSON",{
    transform:function(doc,ret){
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
})

//hashing=convert into string
userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;

})

//login check
//candidatePassword===userPassword
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

//when password is modify then old token is distroy
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangeAt){
        const changedTimestamp = parseInt(
            this.passwordChangeAt.getTime()/1000,
            10
        );
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//forgot password
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")   //convert into hash using sha256
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now()+10 *60*1000;   //expires after 10 min
    return resetToken;
}

const User = mongoose.model("User",userSchema);
export{User};

//crypto = generate secure token when reset or generate
//bcrypt = protect password or specifically desiged alg for
//jsonwebtoken = create and verifies jwts