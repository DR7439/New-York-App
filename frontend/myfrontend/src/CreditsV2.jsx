import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from './axiosInstance';

const stripePromise = loadStripe('pk_test_51Pc9M3G1lxHP5649zctp28aGTDF2cnqAQ6JJvZs0JjSRUvI9jSRblhO5HEpL8BEEHRrhfziB07yWEDtwaYbb7wmA00JaSExqcU');  // Replace with your actual publishable key

export default function Credits() {
    return (
      
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [amount, setAmount] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/api/create-payment-intent/', { amount });

            const clientSecret = response.data.client_secret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        // Add any additional billing details here
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    setSuccess('Payment successful!');
                }
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Buy Creditss1</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>
                <CardElement />
                <button type="submit" disabled={!stripe || loading}>
                    {loading ? 'Processing...' : 'Pay'}
                </button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
        </div>
    );
}
