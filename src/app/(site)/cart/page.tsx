import { CartView } from "@/components/cart/cart-view";

export const metadata = {
  title: "Cart"
};

export default function CartPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Cart</span>
          <h1>Your selected products</h1>
          <p>Review quantities before checkout.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
