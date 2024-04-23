const User = require('../models/User')

module.exports = {
	async store(req, res) {
		try {
            console.log(req.body)
			const { email, firstName, lastName, password } = req.body
            const existentUser = await User.findOne({ email })
            if(!existentUser){
                const user = await User.create({ 
                email: email, 
                firstName: firstName,
                lastName: lastName,
                password: password
            })
            return res.json(user)
            }
            return res.status(400).json({error: "User already exists"})
            
        } catch (error) {
			throw Error(`Error while Registering new user :  ${err}`)
        }
    }
}