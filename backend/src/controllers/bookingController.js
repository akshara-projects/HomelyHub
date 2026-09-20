import{Property} from "../Models/propertyModel.js"
import {Booking} from "../Models/bookingModel.js"

//craete order
const createOrder = async(req,res)=>{
    const {amount,propertyId, fromDate,toDate,guests}= req.body;

    //orderId
    const orderId = "order_" + Date.now();
    res.json({
        sucess:true,
        message:"Order created Sucessfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}

//verifyPayment
const verifyPayment = async(req,res)=>{

    const{orderId, bookingDetails ,forceStatus} = req.body;

    if(forceStatus ==="success"){
        const paymentId = "pay_"+Date.now();

        //save booking
        const newBooking = await Booking.create({
            user: req.user._id,
            property:bookingDetails.propertyId,
            price:bookingDetails.price,
            fromDate:bookingDetails.fromDate,
            toDate:bookingDetails.toDate,
            guests:bookingDetails.guests,
            numberOfnights:bookingDetails.nights,
            paid:true
        });

        //tell property those dates are taken
        const updateProperty = await Property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push:{
                    currentBookings:{
                        bookingId:newBooking._id,
                        fromDate:bookingDetails.fromDate,
                        toDate:bookingDetails.toDate,
                        userId:req.user._id
                    }
                }
            },
            {new:true}
        );
        res.json({
            success:true,
            message:"Payment is successful ,booking confrirmed ! ",
            paymentId,
            orderId,
            booking:newBooking
        });
    }
    else{
        res.status(400).json({
            sucess:false,
            message:"Payment failed",
            orderId
        })
    }
}


//get my bookings
const getUserBookings = async(req,res)=>{
    try{
        const bookings = await Booking.find({user:req.user._id});
        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })

    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.messsage
        })
    }
}

//get one booking detail
// In modern API design, placing a unique ID in the URL path signals that you are targeting that exact, specific resource.
const getBookingDetails = async(req,res)=>{
    try{
        const bookings = await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })
    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })
    }
}

export{createOrder,verifyPayment,getBookingDetails,getUserBookings}