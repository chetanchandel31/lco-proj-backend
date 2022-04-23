const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  const idempotencyKey = uuidv4();

  const amount = products?.reduce(
    (prevVal, currentVal) => prevVal + currentVal.price,
    0
  );

  return (
    stripe.customers
      // 1. create customer
      .create({ email: token.email, source: token.id })
      .then((customer) => {
        // 2. create charges
        stripe.charges
          .create(
            {
              amount: amount * 100,
              currency: "usd",
              customer: customer.id,
              // optional fields
              receipt_email: token.email,
              description: "a test account",
              shipping: {
                name: token.card.name,
                address: {
                  line1: token.card.address_line1,
                  line2: token.card.address_line2,
                  city: token.card.address_city,
                  country: token.card.address_country,
                  postal_code: token.card.address_zip,
                },
              },
            },
            { idempotencyKey } // ensures user isn't charged twice
          )
          .then((result) => res.status(200).json(result))
          .catch((err) => console.log(err));
      })
  );
};
