"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";

import { CONDITIONS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { firstImage, formatPrice } from "@/lib/format";
import type { Product } from "@/types";

type ProductForm = {
  id?: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  condition: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  images: string;
  description: string;
  specs: string;
  featured: boolean;
  active: boolean;
};

const blankForm: ProductForm = {
  title: "",
  brand: "BuildPro",
  category: PRODUCT_CATEGORIES[0].name,
  subcategory: PRODUCT_CATEGORIES[0].subcategories[0],
  condition: "new",
  price: "",
  compareAtPrice: "",
  stock: "1",
  images: "",
  description: "",
  specs: "",
  featured: false,
  active: true
};

function specsToText(product: Product) {
  return product.specs.map((spec) => `${spec.name}: ${spec.value}`).join("\n");
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(blankForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const subcategories = useMemo(() => {
    return PRODUCT_CATEGORIES.find((item) => item.name === form.category)?.subcategories || [];
  }, [form.category]);

  async function loadProducts() {
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setProducts(data.products);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "products");
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    setUploading(false);

    if (response.ok) {
      const data = await response.json();
      update("images", [form.images, data.url].filter(Boolean).join("\n"));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        specs: form.specs
          .split(/\r?\n/)
          .map((line) => line.split(":"))
          .filter(([name, value]) => name?.trim() && value?.trim())
          .map(([name, ...rest]) => ({ name: name.trim(), value: rest.join(":").trim() }))
      })
    });

    setLoading(false);
    if (!response.ok) {
      alert("Product could not be saved.");
      return;
    }

    setForm(blankForm);
    await loadProducts();
  }

  function edit(product: Product) {
    setForm({
      id: product.id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      condition: product.condition,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      stock: String(product.stock),
      images: product.images.join("\n"),
      description: product.description,
      specs: specsToText(product),
      featured: product.featured,
      active: product.active
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.title}?`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadProducts();
    }
  }

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="panel">
        <h2>{form.id ? "Edit Product" : "Add Product"}</h2>
        <form className="admin-form" onSubmit={submit}>
          <div className="admin-form-grid">
            <label className="label">
              Product title
              <input className="field" value={form.title} onChange={(event) => update("title", event.target.value)} required />
            </label>
            <label className="label">
              Brand
              <input className="field" value={form.brand} onChange={(event) => update("brand", event.target.value)} />
            </label>
            <label className="label">
              Condition
              <select className="select" value={form.condition} onChange={(event) => update("condition", event.target.value)}>
                {CONDITIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Category
              <select
                className="select"
                value={form.category}
                onChange={(event) => {
                  const next = PRODUCT_CATEGORIES.find((item) => item.name === event.target.value);
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                    subcategory: next?.subcategories[0] || ""
                  }));
                }}
              >
                {PRODUCT_CATEGORIES.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Subcategory
              <select className="select" value={form.subcategory} onChange={(event) => update("subcategory", event.target.value)}>
                {subcategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Stock
              <input className="field" value={form.stock} onChange={(event) => update("stock", event.target.value)} type="number" />
            </label>
            <label className="label">
              Price
              <input className="field" value={form.price} onChange={(event) => update("price", event.target.value)} type="number" required />
            </label>
            <label className="label">
              Compare price
              <input className="field" value={form.compareAtPrice} onChange={(event) => update("compareAtPrice", event.target.value)} type="number" />
            </label>
            <label className="label">
              Upload image
              <span className="button-row">
                <input className="field" type="file" accept="image/*" onChange={upload} />
                <span className="badge light">{uploading ? "Uploading" : <ImagePlus size={16} />}</span>
              </span>
            </label>
            <label className="label span-3">
              Image URLs
              <textarea className="textarea" value={form.images} onChange={(event) => update("images", event.target.value)} />
            </label>
            <label className="label span-3">
              Description
              <textarea className="textarea" value={form.description} onChange={(event) => update("description", event.target.value)} />
            </label>
            <label className="label span-3">
              Specifications
              <textarea
                className="textarea"
                value={form.specs}
                onChange={(event) => update("specs", event.target.value)}
                placeholder="Processor: Intel Core i5&#10;RAM: 8GB DDR4"
              />
            </label>
          </div>
          <div className="button-row" style={{ flexWrap: "wrap" }}>
            <label className="button-row">
              <input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} />
              Featured
            </label>
            <label className="button-row">
              <input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} />
              Active
            </label>
            <button className="btn primary" disabled={loading}>
              {loading ? "Saving..." : form.id ? "Update Product" : "Add Product"}
            </button>
            {form.id && (
              <button className="btn secondary" type="button" onClick={() => setForm(blankForm)}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <img src={firstImage(product.images)} alt="" style={{ width: 54, height: 44, objectFit: "cover", borderRadius: 8 }} />
                    <div>
                      <strong>{product.title}</strong>
                      <p className="section-copy" style={{ margin: 0 }}>
                        {product.brand}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  {product.category}
                  <br />
                  <span className="section-copy">{product.subcategory}</span>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.active ? "green" : "light"}`}>{product.active ? "Active" : "Hidden"}</span>
                </td>
                <td>
                  <div className="button-row">
                    <button className="icon-button dark" type="button" onClick={() => edit(product)} aria-label="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className="icon-button dark" type="button" onClick={() => remove(product)} aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
