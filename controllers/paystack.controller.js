const request = require("request");
const _ = require('lodash');
const Paystack = require('../models/paystack');
const {
    initializePayment, 
    verifyPayment
} = require('../config/paystack')(request);
const Admin = require("../models/admin");

exports.makePayment = (req, res) => {
    const form = _.pick(req.body, [`amount`,`email`,`fullName`, `products`, `deliveryLocation`]);
    form.metadata = {
        fullName : form.fullName,
        products: form.products,
        deliveryLocation: form.deliveryLocation
    }
    form.amount *= 100;
    initializePayment(form, (error, body)=>{
        if(error){
            res.status(400).json({
                message: "Failed to initialize payment",
                error: error
            })
            return;
       }
       response = JSON.parse(body);
       res.redirect(response.data.authorization_url)
    });
};

exports.verifyPayment = (req,res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error,body) => {
        if(error){
            res.status(400).json({
                message: "Failed to verify payment",
                error: error
            })
            return 
        }

        response = JSON.parse(body);
        const data = _.at(response.data, [
            'reference', 
            'amount',
            'customer.email', 
            'metadata.fullName', 
            'metadata.products', 
            'metadata.deliveryLocation'
        ]); //store them in array using lodash
        
        [reference, amount, email, fullName, products, deliveryLocation] = data; // assign values of array to variables
        const payment = {reference, amount, email, fullName, products, deliveryLocation} // make an object of the variables
        payment.amount /= 100; //convert from kobo to naira
        savePayment(res, payment) 
    })
}


function savePayment(res, payment) {
    Paystack.create(payment).then((payment)=>{
        Admin.updateOne(
            { _id: process.env.ADMIN_ID }, 
            { $push: {sales: payment} }
        ).then(() => {
            res.status(200).json({
                message: "Payment verified",
                payment: payment,
            })
        })
    }).catch((err)=>{
        res.status(400).json({
            message: "Internal server error",
            error: err
        })
    })
}