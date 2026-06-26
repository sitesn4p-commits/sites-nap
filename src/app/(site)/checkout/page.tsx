import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout"
};

export default function CheckoutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Checkout</span>
          <h1>Place your order</h1>
          <p>Choose COD or bank transfer. WhatsApp is required so BuildPro.lk can confirm order details.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <CheckoutForm />
        </div>
      </section>
    </>
  );
}
