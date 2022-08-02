require("dotenv").config({ path: "../.env" });
const express = require("express");
const port = process.env.PORT;
const { resolve } = require("path");
const Paystack = require("@paystack/paystack-sdk");
const crypto = require("crypto");

const app = express();
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
const plan_codes = ["PLN_12qw4oagab13zvy", "PLN_yb73itushktdpth"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.env.STATIC_DIR));

app.get("/", async (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/login.html");
  res.sendFile(path);
});

app.get("/plans", async (req, res) => {
  let fetchPlansResponse = await paystack.plan.list({});

  if (fetchPlansResponse.status === false) {
    console.log("Error fetching plans: ", fetchPlansResponse.message);
    return res
      .status(400)
      .send(`Error fetching subscriptions: ${fetchPlansResponse.message}`);
  }

  let plans = fetchPlansResponse.data.filter(
    (plan) => plan_codes.indexOf(plan.plan_code) !== -1
  );
  return res.status(200).send(plans);
});

app.get("/subscription", async (req, res) => {
  try {
    let { customer } = req.query;

    if (!customer) {
      throw Error("Please include a valid customer ID");
    }

    let fetchSubscriptionsResponse = await paystack.subscription.list({
      customer,
    });

    if (fetchSubscriptionsResponse.status === false) {
      console.log(
        "Error fetching subscriptions: ",
        fetchSubscriptionsResponse.message
      );
      return res
        .status(400)
        .send(
          `Error fetching subscriptions: ${fetchSubscriptionsResponse.message}`
        );
    }

    let subscriptions = fetchSubscriptionsResponse.data.filter(
      (subscription) =>
        (subscription.status === "active" ||
          subscription.status === "non-renewing") &&
        plan_codes.indexOf(subscription.plan.plan_code) !== -1
    );

    return res.status(200).send(subscriptions);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

app.post("/initialize-transaction-with-plan", async (req, res) => {
  try {
    let { email, amount, plan } = req.body;

    if (!email || !amount || !plan) {
      throw Error(
        "Please provide a valid customer email, amount to charge, and plan code"
      );
    }

    let initializeTransactionResponse = await paystack.transaction.initialize({
      email,
      amount,
      plan,
      channels: ["card"],
      callback_url: "http://localhost:2426/account.html",
    });

    if (initializeTransactionResponse.status === false) {
      return console.log(
        "Error initializing transaction: ",
        initializeTransactionResponse.message
      );
    }
    let transaction = initializeTransactionResponse.data;
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.post("/create-subscription", async (req, res) => {
  try {
    let { customer, plan, authorization, start_date } = req.body;

    if (!customer || !plan) {
      throw Error("Please provide a valid customer code and plan ID");
    }

    let createSubscriptionResponse = await paystack.subscription.create({
      customer,
      plan,
      authorization,
      start_date,
    });

    if (createSubscriptionResponse.status === false) {
      return console.log(
        "Error creating subscription: ",
        createSubscriptionResponse.message
      );
    }
    let subscription = createSubscriptionResponse.data;
    return res.status(200).send(subscription);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.post("/cancel-subscription", async (req, res) => {
  try {
    let { code, token } = req.body;

    if (!code || !token) {
      throw Error(
        "Please provide a valid customer code and subscription token"
      );
    }

    let disableSubscriptionResponse = await paystack.subscription.disable({
      code,
      token,
    });

    if (disableSubscriptionResponse.status === false) {
      console.log(
        "Error disabling subscriptions: ",
        disableSubscriptionResponse.message
      );
      return res
        .status(400)
        .send(
          `Error disabling subscriptions: ${disableSubscriptionResponse.message}`
        );
    }

    return res.send("Subscription successfully disabled");
  } catch (error) {
    return res.status(400).send(error);
  }
});

app.get("/update-payment-method", async (req, res) => {
  try {
    const { subscription_code } = req.query;
    const manageSubscriptionLinkResponse =
      await paystack.subscription.manageLink({
        code: subscription_code,
      });
    if (manageSubscriptionLinkResponse.status === false) {
    }

    let manageSubscriptionLink = manageSubscriptionLinkResponse.data.link;
    return res.redirect(manageSubscriptionLink);
  } catch (error) {
    console.log(error);
  }
});

app.post("/create-customer", async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      throw Error("Please include a valid email address");
    }

    let createCustomerResponse = await paystack.customer.create({
      email,
    });

    if (createCustomerResponse.status === false) {
      console.log("Error creating customer: ", createCustomerResponse.message);
      return res
        .status(400)
        .send(`Error creating customer: ${createCustomerResponse.message}`);
    }
    let customer = createCustomerResponse.data;
    // This is where you would save your customer to your DB. Here, we're mocking that by just storing the customer_code in a cookie
    res.cookie("customer", customer.customer_code);
    return res.status(200).send(customer);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

// Handle subscription events sent by Paystack
app.post("/webhook", async (req, res) => {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    const webhook = req.body;
    res.status(200).send("Webhook received");

    switch (webhook.event) {
      case "subscription.create":
      case "charge.success":
      case "invoice.update":
      case "invoice.payment_failed":
      case "subscription.not_renew":
      case "subscription.disable":
      case "subscription.expiring_cards":
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
