const errorHandler = (error, req, res, next) => {
    return res.status(error?.code || 500).send({"error": true, "message": "error?.message"})
}

module.exports = errorHandler;