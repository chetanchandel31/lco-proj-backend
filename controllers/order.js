const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") // TODO: understand `products.product` when on front-end
    .exec((err, order) => {
      if (err) return res.status(400).json({ error: "no order found in db" });

      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile; // inside `order` schema/model, we have specified the need for a `user` property
  const order = new Order(req.body.order);

  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "failed to save order in db",
      });
    }

    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) return res.status(400).json({ error: "no orders found in DB" });

      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

// FIXME: didn't we have to specify that we want the updated document in response
exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) return res.status.json({ error: "cannot update order" });

      res.json(order);
    }
  );
};
