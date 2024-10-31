const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../model/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); 

router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter your email').isEmail(),
    check('password', 'Please enter a password with 8 or more').isLength({
        min: 8,
    }),
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())   {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const { name, email, password } = req.body;
    try{
        //유저가 존재하는지 체크
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({
                errors:[{
                    msg: 'User is already exits'
                }]
            })
        }

        // 유저의 아바타(프로필 사진)
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            password
        })

        // 비밀번호 encrypt
        const salt = await bcrypt.genSalt(10);  //비밀번호를 암호화? 하는 것
        user.password = await bcrypt.hash(password, salt);
        await user.save();

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