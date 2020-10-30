import express from 'express'
import Product from '../models/productModel'
import expressAsyncHandler from 'express-async-handler'
import { isAdmin, isAuth } from '../util'
import data from '../data'

const router = express.Router()

//DB에서 frontend에서 보내준 정보와 일치하는 것을 찾는다.
router.get('/', expressAsyncHandler(async (req, res) => {
    //product DB에서 찾는다..
  const products = await Product.find({})
  //console.log(products)
    res.send(products)
})
)

router.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
      // await Product.remove({});
      const createdProducts = await Product.insertMany(data.products);
      res.send({ createdProducts });
    })
  )

//Product detail page
router.get('/:id', expressAsyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id)
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: 'Product Not Found' })
      }
    })
  )

//saveProduct Action
/* router.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    //frontend(클라이언트)에서 오는 정보를 DB에 보낸다
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        numReviews: req.body.numReviews
    })
    const newProduct = await product.save();
        if (newProduct) {
        return res
            .status(201)
            .send({ message: 'New Product Created', data: newProduct })
        }
        return res.status(500).send({ message: ' Error in Creating Product.' })
    })
)  
//Update product
router.put('/:id', isAuth, isAdmin, async (req, res) => {
    //frontend(클라이언트)에서 오는 정보를 DB에 보낸다
    //parameter로 전달되는 정보
    const productId = req.params.id
    //DB products collection에 있는 값과 파라미터로 전달된 값의 일치 여부 확인
    const product = await Product.findById(productId)
        if(product){
            product.name = req.body.name
            product.price = req.body.price
            product.image = req.body.image
            product.brand = req.body.brand
            product.category = req.body.category
            product.countInStock = req.body.countInStock
            product.description = req.body.description
            //updated Product저장
            const updatedProduct = await product.save()
            if (updatedProduct) {
                return res
                    .status(200)
                    .send({ message: 'Product Updated.', data: updatedProduct })
            }
        }
        return res.status(500).send({ message: ' Error in Upadating Product.' })
    }) */  

    router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
        const product = await Product.findById(req.params.id)
        if(product){
          const deletedProduct = await product.remove()
            res.send({ message: 'Product Deleted.', product: deletedProduct })
        } else {
            res.status(404).send({ message: 'Product Not Found'})
        }
    })
    )
    //관리자 정보 업로드 기능  const { data } = await axios.post('/api/products'..
    router.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
      //새로운 오브젝트를 만든다.
      const product = new Product({
        name: 'sample name ' + Date.now(),
        image: '/images/p1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'sample description'
      })
      //console.log(product)
      const createdProduct = await product.save()
      res.send({ message:'Product Created', product: createdProduct })
    }))

  //편집 
  router.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if(product) {
      product.name = req.body.name
      product.image = req.body.image
      product.price = req.body.price
      product.category = req.body.category
      product.brand = req.body.brand
      product.countInStock = req.body.countInStock
      product.description = req.body.description
      const updatedProduct = await product.save()
      res.send({ message: 'Product Update', product: updatedProduct })
    } else {
      res.status(404).send({ message:'Product Not Found' })
    }
  }) ) 

export default router