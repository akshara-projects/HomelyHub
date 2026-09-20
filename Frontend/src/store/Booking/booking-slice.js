//managing bookings
//store all bookings
//store individual booking details
//track api loading status
//add new bookings when a booking is created
//updating the booking date when we recieve it from backend

import { createSlice } from "@reduxjs/toolkit";
import bookingDetails from "../../components/myBookings/BookingDetails";
const initialState = {
    bookings:[],
    bookingDetails:[],
    loading:false
}
const bookingSlice =createSlice({
    name:"booking",
    initialState,
    reducers:{
        setBookingRequest(state){
            state.loading=true
        },

        //stores bookings recvd from api
        setBookings(state,action){
            state.bookings=action.payload,
            state.loading=false
        },

        //saves new bookings after old ones
        addBooking:(state,action)=>{
            state.bookings.push(action.payload)
        },
        setBookingDetails:(state,action)=>{
            state.bookingDetails = action.payload.bookings
            state.loading=false
        }
    }
})

export const {setBookings, addBooking, setBookingDetails}= bookingSlice.actions
export default bookingSlice