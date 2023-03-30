# Paystack Subscriptions Sample App

This sample application shows how to integrate Paystack's Subscriptions API in your apps. For the official documentation for Paystack Subscriptions, [head over to the docs](https://paystack.com/docs/payments/subscriptions)


## Demo

View a live demo of the app [here](https://codesandbox.io/p/github/PaystackOSS/sample-subscriptions-app/draft/condescending-borg). 

## Get Started

### Requirements
- **A Paystack account**: If you don't already have one, [sign up for a Paystack account](https://dashboard.paystack.com/#/signup). You'll need to do this to get your API keys.
- **API keys**: You can grab these [from your Paystack dashboard](https://dashboard.paystack.com/#/settings/developers)
- **Existing plans**: You'll need to have existing (active) plan objects that you can subscribe your customers to. If you don't already have any plans, you can just create a couple [from your Paystack dashboard](https://dashboard.paystack.com/#/plans?status=active)

### Running the sample locally

1. Clone this repo:
```
git clone https://github.com/PaystackOSS/sample-subscriptions-app
```

2. Navigate to the root directory and install dependencies
```
npm install
```

3. Rename the `.env.example` file to `.env` and add your Paystack secret key, and your server's URL including the port. This is necessary for the callback URL you'll be redirected to after completing a transaction. You can also change the default port from 5000 to a port of your choosing:

```
PAYSTACK_SECRET_KEY=sk_domain_xxxxxx
SERVER_URL=http://localhost:5000
```

4. Start the application

```
npm start
```

5. Visit http://localhost:5000 in your browser to interact with the app. You should be able to signup/login, subscribe to a plan, and view/manage your existing plan(s).



## Contributing
If you notice any issues with this app, please [open an issue](https://github.com/PaystackOSS/sample-subscriptions-app/issues/new). PRs are also more than welcome, so feel free to [submit a PR](https://github.com/PaystackOSS/sample-subscriptions-app/compare) to fix an issue, or add a new feature!

## License

This repository is made available under the MIT license. Read [LICENSE.md](https://github.com/PaystackOSS/sample-subscriptions-app/blob/master/LICENSE.md) for more information.

