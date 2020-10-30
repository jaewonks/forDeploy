import express from 'express'
import Order from '../models/orderModel'
import expressAsyncHandler from 'express-async-handler'
import { isAdmin, isAuth } from '../util'


const router = express.Router()

router.get('/', isAuth, isAdmin, expressAsyncHandler( async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name'); //gonna load names of users in all orders 
  res.send(orders);
}))

// '/mine인데 history로 바꿈
router.get('/history', isAuth, expressAsyncHandler(async (req,res) => {
  const orders = await Order.find({ user: req.user._id })
  //console.log(req.user._id)
  res.send(orders)
  //console.log(orders)
}))

router.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res.status(201).send({ message: 'New Order Created', order: createdOrder });
    }
  })
);

//props.history.push(`/order/${order._id}`)
router.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id)
      //.findById(req.params.id)
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

router.put('/:id/pay', isAuth, expressAsyncHandler(async (req,res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    }
    const updatedOrder = await order.save()
      res.send({ message: 'Order Paid', order: updatedOrder })
  } else {
    res.status(404).send({ message: 'Order Not Found' })
  }
}))  

router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    const deleteOrder = await order.remove()
    res.send({ message: 'Order Deleted', order: deleteOrder })
  } else {
    res.status(404).send({ message: 'Order Not Found' })
  }
}))

router.put('/:id/deliver', isAuth, expressAsyncHandler(async (req,res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
      res.send({ message: 'Order Delivered', order: updatedOrder })
  } else {
    res.status(404).send({ message: 'Order Not Found' })
  }
}))

export default router