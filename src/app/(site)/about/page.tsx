export const metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About BuildPro.lk</span>
          <h1>Computer parts with clear order handling</h1>
          <p>
            BuildPro.lk is designed for selling PC components, used desktops, gaming accessories, and upgrade parts with
            a simple ordering flow, clear payment options, and quick WhatsApp-based order follow-up.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <div className="panel">
            <h2>What customers can do</h2>
            <p className="section-copy">
              Customers can browse products, filter by category, add items to cart, place COD or bank transfer orders,
              and leave reviews on product detail pages.
            </p>
          </div>
          <div className="panel">
            <h2>Payment and support</h2>
            <p className="section-copy">
              Customers can choose Cash on Delivery or bank transfer. Bank details are shared privately after the order
              is checked, keeping the checkout page simple and secure.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
