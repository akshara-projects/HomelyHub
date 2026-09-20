//which property????
//which user
//price
//dates
//guests
//paid

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        property:{
            type:mongoose.Schema.ObjectId,
            ref:"Property",
            required:[true,"booking must belong to a Property "]
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:[true,"booking must belong to a user"]
        },
        price:{
            type:Number,
            required:[true,"please must have price "]
        },
        createdAt:{
            type:Date,
            default:Date.now()
        },
        paid:{
            type:Boolean,
            default:true
        },
        fromDate:{
            type:Date,
        },
        toDate:{
            type:Date
        },
        guests:{
            type:Number
        },
        numberOfnights:{
            type:Number
        }
    },
    {timeStamps:true}
);

//^find means findOne()
bookingSchema.pre(/^find/,function(){
    //means upper we write objectid so thats shows which id booking not thats user name so populate fetch taht
    this.populate("user");
        
        this.populate({
        path:"property",
        select:"maximumGuest images propertyName address"
    });

})


const Booking = mongoose.model("Booking",bookingSchema);

export {Booking};