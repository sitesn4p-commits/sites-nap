import Link from "next/link";

export function Footer() {
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>BuildPro.lk</h3>
          <p>
            Computer parts, used desktops, gaming gear, and upgrade essentials for buyers who want clear pricing and
            practical support.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <div className="footer-links">
            <Link href="/products">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>
        <div>
          <h4>Company</h4>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <h4>Social</h4>
          <div className="footer-links">
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
