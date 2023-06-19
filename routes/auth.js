/* 
Auth routes 
host + /api/auth
*/

const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {validateFields} = require('./../middlewares/fields-validators');
const {validateJWT} = require('./../middlewares/jwt-validators');

const { createUser, login, renew } = require('../controllers/auth');

router.post('/new', 
    [
        // middlewares
        check('name', 'Name obligatory.').not().isEmpty(),
        check('email', 'Email obligatory.').isEmail(),
        check('password', 'Password must be longer than 6 characters.').isLength({min: 6}),
        validateFields

    ] ,
    createUser
);

router.post('/',
    [
        // middlewares
        check('email', 'Email obligatory.').isEmail(),
        check('password', 'Password must be longer than 6 characters.').isLength({min: 6}),
        validateFields
    ],
    login
);

router.get('/renew', validateJWT, renew);

module.exports = router;