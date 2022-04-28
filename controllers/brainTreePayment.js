const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    // 1. generate & pass clientToken to your front-end
    // const clientToken = response.clientToken;
    if (err) {
      res.status(500).json(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  const { amount, nonceFromTheClient } = req.body;

  // 2. make a transaction
  gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) res.status(500).json(error);
      else res.json(result);
    }
  );
};
