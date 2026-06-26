export const metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Privacy Policy</span>
          <h1>Customer data handling</h1>
          <p>BuildPro.lk collects only the details needed to process orders, contact customers, and manage reviews.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <div className="panel">
            <h2>Information collected</h2>
            <p className="section-copy">
              Order forms collect customer name, phone number, WhatsApp number, delivery address, city, optional email,
              notes, selected products, and chosen payment method.
            </p>
          </div>
          <div className="panel">
            <h2>Payment details</h2>
            <p className="section-copy">
              Bank details are not displayed publicly on the website. For bank transfer orders, BuildPro.lk contacts the
              customer through WhatsApp after checking the order.
            </p>
          </div>
          <div className="panel">
            <h2>Reviews</h2>
            <p className="section-copy">
              Product reviews may show the customer name, star rating, title, comment, and any BuildPro.lk reply. WhatsApp
              numbers submitted with reviews are kept for admin reference and are not shown publicly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
