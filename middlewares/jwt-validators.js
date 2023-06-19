const {request, response} = require('express');
const jwt = require('jsonwebtoken');

/* x-token in headers */
const validateJWT = (req = request, res = response, next) => {
    
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token in request.'
        });
    }

    try {
        
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        );

        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token not valid.'
        })
    }

    next();
}

module.exports = {
    validateJWT,
}