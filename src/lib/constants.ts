import type { OrderStatus, ProductCondition } from "@/types";

export const SITE_NAME = "BuildPro.lk";

export const COD_CHARGE = 250;

export const PRODUCT_CATEGORIES = [
  {
    name: "Desktop PCs",
    subcategories: [
      "Used Branded PCs",
      "Used Assembled PCs",
      "Office PCs",
      "Gaming PCs",
      "Core i3 PCs",
      "Core i5 PCs",
      "Custom PC Builds"
    ]
  },
  {
    name: "PC Components",
    subcategories: [
      "Processors / CPU",
      "Motherboards",
      "VGA / Graphics Cards",
      "RAM Cards",
      "Desktop RAM",
      "Laptop RAM",
      "DDR3 RAM",
      "DDR4 RAM",
      "Desktop HDD",
      "Laptop HDD",
      "SSD",
      "NVMe SSD",
      "PSU / Power Supply",
      "CPU Coolers",
      "Cooling Fans",
      "Casing Fans",
      "DVD RW"
    ]
  },
  {
    name: "Peripherals",
    subcategories: [
      "Keyboards",
      "Mechanical Keyboards",
      "Mice",
      "Keyboard & Mouse Combos",
      "Mouse Pads",
      "Headsets",
      "Headset Stands",
      "Microphones",
      "Speakers",
      "Bluetooth Speakers",
      "Laptop Bags",
      "Keyboard & Mouse"
    ]
  },
  {
    name: "Gaming Accessories",
    subcategories: [
      "Gaming Mice",
      "Gaming Keyboards",
      "Gaming Headsets",
      "Headset Stands",
      "Gaming Mouse Pads",
      "Gaming Controllers",
      "Steering Wheels",
      "Gaming Speakers",
      "RGB Mouse Pads",
      "Cooling Pads",
      "Cooling Fans",
      "Gaming PSU",
      "Gaming SSD",
      "Gaming RAM",
      "Gaming Cases",
      "Gaming Tables",
      "Gaming Chairs"
    ]
  },
  {
    name: "Laptop Accessories",
    subcategories: [
      "Laptop Cooling Pads",
      "Laptop Bags",
      "Laptop RAM",
      "Laptop HDD",
      "Laptop SSD",
      "Laptop Keyboards",
      "Laptop Mice",
      "Laptop Chargers"
    ]
  }
];

export const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" }
];

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packed", label: "Packed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

export const DEFAULT_SLIDES = [
  {
    id: "default-desktop-builds",
    title: "Build Faster. Upgrade Smarter.",
    subtitle: "PC parts, used desktops, gaming gear, and accessories selected for everyday Sri Lankan buyers.",
    buttonLabel: "Shop Products",
    href: "/products",
    desktopImage: "/assets/hero-desktop.png",
    mobileImage: "/assets/hero-mobile.png",
    sortOrder: 1,
    active: true,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString()
  }
];
