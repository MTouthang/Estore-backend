const stripe = require("stripe")(
  "sk_test_51HBIlVElH1UyXDxX0bpCQxBmhEaMrs7n5b2c53anh95YAQ5egH1R1kJA7wNgfEHOcH7zQLxoN8GV3ECZnhG86RHc00lqLRhXie"
);
const uuid = require("uuid/v4");
const { result } = require("lodash");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;
  const product = req.body;
  console.log(product);
  console.log("PRODUCTS", products);

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test account",

            shipping: {
              name: token.card.name,
            },
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
