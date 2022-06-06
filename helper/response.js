module.exports = {
    successResponse: (res,message, code, resData) => {
        res.status(code).json({
            status: 'SUCCESS',
            message : message,
            code: code,
            data: resData
        });
    },
    errorMsgResponse: (res, code, resData) => {
        res.status(code).json({
            status: 'ERROR',
            code: code,
            message: resData
        });
    },
}