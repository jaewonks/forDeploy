import multer from 'multer'
import express from 'express'
import { isAuth } from '../util'

const router = express.Router()
//이미지 저장소
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/')
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}.jpg`)
  },
})

const upload = multer({ storage })

router.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router