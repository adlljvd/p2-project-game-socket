const errorHandler = async () => {
    let status = 500;
    let message = "Internal server error";

    console.log(error);

    if (error.name === "SequelizeValidationError") {
        status = 400;
        message = error.errors[0].message;
    }


    if (error.name === "SequelizeUniqueConstraintError") {
        status = 400;
        message = error.errors[0].message;
    }



    if (error.name === "DataNotFound") {
        status = 404;
        message = "Data not found";
    }


    res.status(status).json({
        message,
    });
}

module.exports = errorHandler