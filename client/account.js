window.addEventListener('DOMContentLoaded', async () => {
  const customer_id = window.localStorage.getItem('customer_id');
  const customer_email = window.localStorage.getItem('customer_email');

  const subscriptions = await fetch(
    `/subscription?customer=${customer_id}`
  ).then((res) => res.json());
  let subscription = subscriptions[0];

  if (subscription) {
    const subscriptionInfoDiv = document.getElementById('subscription-info');
    subscriptionInfoDiv.innerHTML = `
      <hr>
      <p>Hi ${customer_email}<p>
      <p>You're currently on the ${subscription.plan.name} plan</p>
      <p>
        Status: ${subscription.status}
      </p>
      <p>
        Subscription Code: ${subscription.subscription_code}
      </p>
      <p>
        Card on file: ${subscription.authorization.brand} card ending in ${
      subscription.authorization.last4
    } expires on ${subscription.authorization.exp_month}/${
      subscription.authorization.exp_year
    }
    </p>
    <p>
      Next payment date: ${new Date(subscription.next_payment_date)}
    </p>
  
    <a href="/update-payment-method?subscription_code=${
      subscription.subscription_code
    }" target="_blank"> Manage subscription </a><br />
    `;
  } else {
    const plans = await fetch('/plans', {
      method: 'get',
    })
      .then((res) => res.json())
      .catch((error) => console.log(error));

    let accountDashDiv = document.getElementById('account-dashboard');
    accountDashDiv.innerHTML +=
      '<p>You are currently not on any plan. Select a plan below to subscribe.</p>';

    let selectPlanDiv = document.createElement('div');
    selectPlanDiv.style.display = 'flex';
    selectPlanDiv.style.flexDirection = 'row';

    plans.forEach((plan) => {
      let planDiv = document.createElement('div');
      planDiv.innerHTML = `
      <div class="card" style="width: 18rem; margin: 1rem; text-align: center">
      <div class="card-body">
        <h5 class="card-title">${plan.name}</h5>
        <p class="card-subtitle mb-2 text-muted">${plan.currency} ${
        plan.amount / 100
      }/month</p>
        <p class="card-text">${plan.description}</p>
        <button class="btn btn-primary" style="width: 10rem; text-align: center" onclick="signUpForPlan('${
          plan.plan_code
        }')">Subscribe</button>
      </div>
      </div>
    `;

      selectPlanDiv.append(planDiv);
    });
    accountDashDiv.append(selectPlanDiv);
  }
});

async function signUpForPlan(plan_code) {
  let email = window.localStorage.getItem('customer_email');
  let { authorization_url } = await fetch('/initialize-transaction-with-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: 50000,
      plan: plan_code,
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.log(error));

  window.location.href = authorization_url;
}
