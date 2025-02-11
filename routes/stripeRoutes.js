import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('sk_test_51QRZeURxBBzO6509fL9OIbDAE5A4TgTkd0qLc3WP2ICdOuvT7xQ80lRip1BfRZKhzevr9075nVfHUu3wCsSjIVSY00uu3trvxe', {
    apiVersion: '2025-01-27.acacia',
});

router.post('/create-checkout-session', async (req, res) => {
    const { planId, userEmail, successUrl, cancelUrl } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            customer_email: userEmail,
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;