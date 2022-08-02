window.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("signin-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;

      const customer = await fetch("/create-customer", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      window.localStorage.setItem("customer_email", email);
      window.localStorage.setItem("customer_code", customer.customer_code);
      window.localStorage.setItem("customer_id", customer.id);

      window.location.href = "/account.html";
    });
  }
});
