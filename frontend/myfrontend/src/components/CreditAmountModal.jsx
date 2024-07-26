import { ExclamationCircleFilled, ShoppingOutlined } from "@ant-design/icons";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, InputNumber, message, Modal, Slider } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
const { confirm } = Modal;

const stripePromise = loadStripe(
  "pk_test_51Pc9M3G1lxHP5649zctp28aGTDF2cnqAQ6JJvZs0JjSRUvI9jSRblhO5HEpL8BEEHRrhfziB07yWEDtwaYbb7wmA00JaSExqcU"
); // Replace with your actual publishable key

export default function CreditAmountModal() {
  const [creditAmount, setCreditAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const price = creditAmount * 0.1;

  const handleCreditNumber = (value) => {
    setCreditAmount(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreditAmount(0);
  };

  const handleOK = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary" icon={<ShoppingOutlined />}>
        Top Up Credit
      </Button>
      {isModalOpen && (
        <Modal
          title="Top Up Your Credits"
          centered={true}
          open={true}
          onCancel={closeModal}
          width={600}
          footer={null}
        >
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <p>Enter the number of credits you would like to purchase.</p>
              <div className="flex items-center gap-2">
                <Slider
                  step={5}
                  value={creditAmount}
                  onChange={handleCreditNumber}
                  min={0}
                  max={1000}
                  className="grow"
                />
                <InputNumber
                  value={creditAmount}
                  onChange={handleCreditNumber}
                  min={0}
                  max={1000}
                />
              </div>
              <div
                value={price}
                className="text-lg flex items-center justify-between"
              >
                <span>Total: </span>
                <b>${price.toFixed(2)}</b>
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                key={isModalOpen}
                amount={creditAmount}
                onCancel={closeModal}
                onOk={handleOK}
              />
            </Elements>
          </div>
        </Modal>
      )}
    </>
  );
}

function CheckoutForm({ amount, onCancel, onOk }) {
  const price = amount * 0.1;
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  useEffect(() => {
    if (!elements) {
      return;
    }
    let card = elements.getElement(CardElement);
    card.on("change", (event) => {
      if (event.complete) {
        setCardComplete(true);
      }
    });
  }, [elements]);
  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    setError(null);
    let card = elements.getElement(CardElement);

    try {
      const response = await axiosInstance.post("/api/users/create-payment-intent/", {
        amount,
      });
      const clientSecret = response.data.client_secret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            // Add any additional billing details here
          },
        },
      });
      if (result.error) {
        setError(result.error.message);
        message.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          card.clear();
          setSuccess("Payment successful!");
          message.success("Payment successful!");
          setTimeout(() => {
            onOk();
          }, 2000);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  let style = {
    base: {
      color: "#44403c",
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      // backgroundColor: "#f3f4f6",
      lineHeight: "36px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#78716c",
      },
      "::focus": {
        backgroundColor: "#f3f4f6",
      },
    },
    // red color
    invalid: {
      iconColor: "#dc2626",
      color: "#dc2626",
    },
  };

  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to top up this amount?",
      icon: <ExclamationCircleFilled />,
      content:
        "This top-up will incur costs equivalent to the credit amount you have selected.",
      okText: "Yes",
      centered: true,
      onOk() {
        handleSubmit();
      },
    });
  };

  const payButtonTexxt = amount ? `Pay $${price.toFixed(2)}` : "Pay";
  return (
    <div className="space-y-2">
      <p className="text-base font-bold">Your payment infomation</p>
      <div className="px-2 border border-gray-300 rounded-md">
        <CardElement
          options={{
            style,
            hidePostalCode: true,
          }}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <div className="flex justify-end items-center gap-2 pt-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={showConfirm}
          loading={loading}
          disabled={loading || !stripe || !price || !cardComplete}
          className="w-28"
        >
          {payButtonTexxt}
        </Button>
      </div>
    </div>
  );
}
