import jwt from 'jsonwebtoken'
import config from './config/key' 

const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    }, config.JWT_SECRET, 
    {
       expiresIn: '48h'
    })
}

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization 
    if(authorization){
        const token = authorization.slice(7, authorization.length) //Bearer XXXXXX
        jwt.verify(token, config.JWT_SECRET, (err, decode) => {
            if(err) {
                return res.status(401).send({ message: 'Invaild Token.' })
            } else {
                req.user = decode
                next()
            }
        })
    } else {
        return res.status(401).send({ message: 'Token is not supplied.' })
    }
}

const isAdmin = ( req, res, next ) => {
    if(req.user && req.user.isAdmin){
      next()
    } else {
      return res.status(401).send({ message: 'Admin Toekn is not valid.' })
    }
}

export { generateToken, isAuth, isAdmin }