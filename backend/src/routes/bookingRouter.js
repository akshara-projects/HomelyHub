import express from "express";
import{createOrder,verifyPayment,getBookingDetails,getUserBookings} from "../controllers/bookingController.js";
import{protect} from "../controllers/authController.js"
const bookingRouter = express.Router()

bookingRouter.get("/",protect,getUserBookings);
bookingRouter.get("/:bookingId",protect,getBookingDetails);
bookingRouter.post("/create-order",protect,createOrder);
bookingRouter.post("/verify-payment",protect,verifyPayment);

export{bookingRouter};
