import type { Metadata } from "next";

import "@/app/globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Computer Parts Store`,
    template: `%s | ${SITE_NAME}`
  },
  description: "Computer parts, used desktops, gaming accessories, and PC upgrades in Sri Lanka."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
