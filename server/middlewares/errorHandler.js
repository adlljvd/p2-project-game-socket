const errorHandler = async (error, req, res, next) => {
    console.log(error, '<<<<<<<<<<<<<<<<<<<<<<,,,,,,,,,<<<<<<<,,<,<,,<,,<,<,<,,,<<,<,<,<,<<<<<');
    let status = 500;
    let message = "Internal server error";


    if (error.name === "SequelizeValidationError") {
        status = 400;
        message = error.errors[0].message;
    }
    if (error.name === "SequelizeUniqueConstraintError") {
        status = 400;
        message = error.errors[0].message;
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
        status = 422;
        message = 'Please select an existing category'
    }

    if (error.name === "DataNotFound") {
        status = 404;
        message = "Data not found";
    }

    if (error.name === 'RoomNotFound') {
        status = 404
        message = 'Room not found'
    }

    res.status(status).json({
        message,
    });
}

module.exports = errorHandler