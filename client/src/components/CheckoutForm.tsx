import React from "react";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { StripeCardNumberElement } from "@stripe/stripe-js";

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | undefined>(undefined);
    const [clientSecret, setClientSecret] = useState<string>("");

    const fetchClientSecret = async () => {
        const response = await fetch("http://localhost:3000/create-payment-intent",
            {
                method: "POST",
                body: JSON.stringify({

                })
            });
        const responseJSON = await response.json();
        const { clientSecret } = responseJSON;
        setClientSecret(clientSecret);
    }

    useEffect(() => {
        fetchClientSecret();
    }, []);


    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        // Abort if form isn't valid
        if (!event.currentTarget.reportValidity()) return;
        if (!elements || !stripe) return;


        const card = elements.getElement(CardNumberElement) as StripeCardNumberElement;
        if (!clientSecret) fetchClientSecret();

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: "zehan khan",
                },
            }
        });

        console.log(paymentIntent);

        if (error) {
            error.message as string | undefined
            setError(error.message);
        } else {
            // Send the token to your server or handle it as necessary
            console.log("");
            // Clear the form or redirect to a success page
        }
    };


    return (<>
        <form onSubmit={handleSubmit}>
            <div>
                <PageSubTitle
                    className="my-3 !text-black !text-opacity-70"
                    subTitle="Enter your Card Number"
                />

                <CardNumberElement className="bg-white p-4 border-2 rounded-xl" options={CARD_ELEMENT_OPTIONS} />
                <br />
            </div>
            <div>
                <PageSubTitle
                    className="my-3 !text-black !text-opacity-70"
                    subTitle="Enter your CVC Number"
                />

                <CardCvcElement className="bg-white p-4 border-2 rounded-xl" options={CARD_ELEMENT_OPTIONS} />
                <br />
            </div>
            <div>
                <PageSubTitle
                    className="my-3 !text-black !text-opacity-70"
                    subTitle="Enter your Card Expiry"
                />
                <CardExpiryElement className="bg-white p-4 border-2 rounded-xl" options={CARD_ELEMENT_OPTIONS} />
                <br />
            </div>
            <button disabled={!stripe} className='my-8 h-20 w-full bg-[linear-gradient(140deg,#3341FF,#9A15F7)] text-white text-4xl'>
                Buy Now
            </button>
            <div>
                {error && <div className="text-3xl text-red-600">{error}</div>}
            </div>
        </form>
    </>)
};


// style for stripe components
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "black",
            background: "white",
            letterSpacing: '0.025em',
            fontSize: "30px",
            fontFamily: "sans-serif",
            fontSmoothing: "antialiased",
            "::focus": {
                border: "2px solid purple"
            },
            "::placeholder": {
                color: "rgba(0, 0, 0, 0.5)"
            },
        },
        invalid: {
            color: "red",
            ":focus": {
                color: "red",
            },
        },
    },
};

export default CheckoutForm;


interface TitleProps {
    subTitle: string;
    className?: string;
}

export const PageSubTitle: React.FC<TitleProps> = ({ subTitle, className = '' }) => {
    return (
        <div>
            <h1 className={`text-hb-purple text-xs lg:text-3xl font-lato font-normal ${className} leading-snug`} >{subTitle}</h1>
        </div>
    );
};
