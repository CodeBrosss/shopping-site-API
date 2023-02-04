const errorHandler = (err,req,res,next) =>{
    let CustomError = {
        statusCode :err.statusCode || 500,
        msg: err.message || 'something went wrong, Please try again'
    }

    // check and handle validation error
    if(err.name === 'validation error'){
        CustomError.msg = Object.values(err.errors).map((item) => item.message.join(','));
        CustomError.statusCode = 400;
    }

    // check for duplicate values amd handle the error
    if(err.code && err.code === 11000){
        CustomError.msg = `Duplicate value entered for ${Object.keys(err.KeyValue)} field, Please choose another value`;
        CustomError.statusCode = 400;
    }

    // check for cast errors or searchs with wrong id and handle the error
    if(err.name === 'CastError'){
        CustomError.msg = `No item with such id`;
        CustomError.statusCode = 400;
    }

    return res.status(CustomError.statusCode).json({msg: CustomError.msg});

}


module.exports = errorHandler;