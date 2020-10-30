import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/userModel'
import { generateToken, isAuth } from '../util'

const router = express.Router()

//DB에서 frontend에서 보내준 정보와 일치하는 것을 찾는다.
router.post('/signin', expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
    }) //frontend에서 보내준 정보와 일치하면
    //console.log(signinUser)
    if (signinUser) {
      if (bcrypt.compareSync(req.body.password, signinUser.password)){
        res.send({
          _id: signinUser._id,
          name: signinUser.name,
          email: signinUser.email,
          isAdmin: signinUser.isAdmin,
          token: generateToken(signinUser),
        })
        return
      }
    } 
    res.status(401).send({ message: 'Invalid Email or Password.' });
  })
)  
//server.js app.get('/api/users', userRoute)

//DB에서 frontend에서 보내준 정보와 일치하는 것을 찾는다.
router.post('/signup', expressAsyncHandler(async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }) //frontend에서 보내준 정보와 일치하면
  //console.log(newUser)
  const newUser = await user.save()
  if (newUser) {
      res.send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser)
      })
    } else {
      res.status(401).send({ message: 'Invalid User Data.' });
    }
  })
)

router.get('/:id', expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if(user) {
    res.send(user)
  } else {
    res.status(404).send({ message: 'User Not Found' })
  }
}))

//const { data } = await axios.put(`/api/users/profile`, user
//권한이 있는 사람만 접근 가능, isAuth
router.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if(user) { //클라이언트(frontend)에서 받은 정보 추가
    user.name = req.body.name || user.name // 전해받은 정보 || 이전의 정보
    user.email = req.body.email || user.email
    if(req.body.password){
      user.password = bcrypt.hashSync(req.body.password, 8)
    }
    const updatedUser = await user.save()
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      idAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser)
    })
  }

}))


export default router