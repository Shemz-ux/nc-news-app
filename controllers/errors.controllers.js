
exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({msg: 'Invalid request'})
    }
    next(err)
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
}