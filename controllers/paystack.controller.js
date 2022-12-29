const request = require("request");
const _ = require('lodash');
const Paystack = require('../models/paystack');
const {
    initializePayment, 
    verifyPayment
} = require('../config/paystack')(request);

exports.makePayment = (req, res) => {
    const form = _.pick(req.body,[`amount`,`email`,`full_name`]);
    form.metadata = {
        full_name : form.full_name
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
        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']); //store them in array using lodash
        console.log(data)
        let reference = data[0];
        [reference, amount, email, full_name] = data; // assign values of array to variables
        const payment = {reference, amount, email, full_name} // make an object of the variables
        Paystack.create(payment).then((payment)=>{
            if(payment){
                res.status(200).json({
                    message: "Payment verified",
                    payment: payment,
                })
            }
        }).catch((e)=>{
            res.status(400).json({
                message: "Internal server error",
                error: e
            })
        })
         
    })
}