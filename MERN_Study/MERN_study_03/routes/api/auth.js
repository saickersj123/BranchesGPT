const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); 


router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/', 
[
    check('email', 'Please enter your email').isEmail(),
    check('password', 'Please enter a password with 8 or more').exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())   {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const { email, password } = req.body;
    try{
        //유저가 존재하는지 체크
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                errors:[{
                    msg: 'User is not exits'
                }]
            })
        }

        //비밀번호가 일치한지 체크?
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){{
            return res.status(400).json({
                errors: [{
                    msg:'User in not exists'
                }]
            });
        }}

        // jsonwebtoken return
        const payload = {
            user: {
                id : user.id
            }
        }
        jwt.sign(payload,
            config.get('jswtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err){
                    throw RegExp;
                }
                res.json({
                    token
                })
            }
        );
    }   catch(err){
            console.error(err.message);
            res.status(500).send('Server error');        
    }
});

module.exports = router;