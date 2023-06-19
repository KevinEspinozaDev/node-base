const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/User');
const {generateJWT} = require('./../helpers/jwt');

/* HTTPS STATUS CODES */
/*
200 = OK
201 = Created
202 Accepted
400 Bad request
401 Unauthorized
402 Payment required
403 Forbidden
404 Not found
408 Request timeout
500 Internal server error
502 Bad gateway
*/


const createUser = async(req, res = express.response) => {

    const {email, password} = req.body;

    try {

        let user = await User.findOne({email});
        
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'An user already exist with that email.'
            })
        }

        user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        // End endcryption
    
        await user.save();

        // Generate JWT
        const token = await generateJWT(user.id, user.name);

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact admin or support.'
        })
    }

}

const login = async(req, res = express.response) => {

    const {email, password} = req.body;
    
    try {
        
        const user = await User.findOne({email});
            
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'No one user exist with that email.'
            });
        }
    
        // Confirm passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password.'
            });
        }
    
        // Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact admin or support.'
        })
    }
};

const renew = async(req, res = express.response) => {

    const {uid, name} = req;

    // Generaar nuevo jwt y retornarlo en esta peticion
    const token = await generateJWT(uid, name);


    res.json({
        ok: true,
        token,
    });
};

module.exports = {
    createUser,
    login,
    renew
}