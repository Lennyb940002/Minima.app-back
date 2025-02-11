const express = require('express');
const Stripe = require('stripe');
const { User } = require('../models/User');

const router = express.Router();
const stripe = new Stripe('sk_test_51QRZeURxBBzO6509fL9OIbDAE5A4TgTkd0qLc3WP2ICdOuvT7xQ80lRip1BfRZKhzevr9075nVfHUu3wCsSjIVSY00uu3trvxe', {
    apiVersion: '2025-01-27.acacia',
});

const endpointSecret = 'whsec_...'; // Your webhook secret

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        // Find user by Stripe customer ID and update payment status
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
            user.hasPaid = true;
            await user.save();
        }
    }

    res.json({ received: true });
});

module.exports = router;