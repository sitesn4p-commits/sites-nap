"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Slider } from "@/types";

type SliderForm = {
  id?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  href: string;
  desktopImage: string;
  mobileImage: string;
  sortOrder: string;
  active: boolean;
};

const blank: SliderForm = {
  title: "",
  subtitle: "",
  buttonLabel: "Shop Now",
  href: "/products",
  desktopImage: "",
  mobileImage: "",
  sortOrder: "1",
  active: true
};

export function AdminSliders() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [form, setForm] = useState<SliderForm>(blank);
  const [uploading, setUploading] = useState("");

  async function loadSliders() {
    const response = await fetch("/api/admin/sliders", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setSliders(data.sliders);
    }
  }

  useEffect(() => {
    loadSliders();
  }, []);

  function update<K extends keyof SliderForm>(key: K, value: SliderForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function upload(event: ChangeEvent<HTMLInputElement>, target: "desktopImage" | "mobileImage") {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(target);
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "sliders");
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    setUploading("");
    if (response.ok) {
      const data = await response.json();
      update(target, data.url);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = form.id ? `/api/admin/sliders/${form.id}` : "/api/admin/sliders";
    const method = form.id ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      alert("Slider could not be saved.");
      return;
    }

    setForm(blank);
    await loadSliders();
  }

  async function remove(slider: Slider) {
    if (!window.confirm(`Delete ${slider.title}?`)) return;
    const response = await fetch(`/api/admin/sliders/${slider.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadSliders();
    }
  }

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="panel">
        <h2>{form.id ? "Edit Slide" : "Add Slide"}</h2>
        <form className="admin-form" onSubmit={submit}>
          <div className="admin-form-grid">
            <label className="label">
              Title
              <input className="field" value={form.title} onChange={(event) => update("title", event.target.value)} required />
            </label>
            <label className="label">
              Button label
              <input className="field" value={form.buttonLabel} onChange={(event) => update("buttonLabel", event.target.value)} />
            </label>
            <label className="label">
              Link
              <input className="field" value={form.href} onChange={(event) => update("href", event.target.value)} />
            </label>
            <label className="label">
              Desktop image
              <input className="field" type="file" accept="image/*" onChange={(event) => upload(event, "desktopImage")} />
            </label>
            <label className="label">
              Mobile image
              <input className="field" type="file" accept="image/*" onChange={(event) => upload(event, "mobileImage")} />
            </label>
            <label className="label">
              Sort order
              <input className="field" value={form.sortOrder} type="number" onChange={(event) => update("sortOrder", event.target.value)} />
            </label>
            <label className="label span-3">
              Subtitle
              <textarea className="textarea" value={form.subtitle} onChange={(event) => update("subtitle", event.target.value)} required />
            </label>
            <label className="label span-3">
              Desktop image URL
              <input className="field" value={form.desktopImage} onChange={(event) => update("desktopImage", event.target.value)} required />
            </label>
            <label className="label span-3">
              Mobile image URL
              <input className="field" value={form.mobileImage} onChange={(event) => update("mobileImage", event.target.value)} required />
            </label>
          </div>
          {uploading && <p className="section-copy">Uploading {uploading === "desktopImage" ? "desktop" : "mobile"} image...</p>}
          <div className="button-row">
            <label className="button-row">
              <input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} />
              Active
            </label>
            <button className="btn primary">{form.id ? "Update Slide" : "Add Slide"}</button>
            {form.id && (
              <button className="btn secondary" type="button" onClick={() => setForm(blank)}>
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
              <th>Slide</th>
              <th>Images</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider) => (
              <tr key={slider.id}>
                <td>
                  <strong>{slider.title}</strong>
                  <p className="section-copy" style={{ margin: 0 }}>
                    {slider.subtitle}
                  </p>
                </td>
                <td>
                  <div className="button-row">
                    <img src={slider.desktopImage} alt="" style={{ width: 86, height: 48, objectFit: "cover", borderRadius: 8 }} />
                    <img src={slider.mobileImage} alt="" style={{ width: 42, height: 58, objectFit: "cover", borderRadius: 8 }} />
                  </div>
                </td>
                <td>{slider.sortOrder}</td>
                <td>
                  <span className={`badge ${slider.active ? "green" : "light"}`}>{slider.active ? "Active" : "Hidden"}</span>
                </td>
                <td>
                  <div className="button-row">
                    <button
                      className="icon-button dark"
                      type="button"
                      onClick={() =>
                        setForm({
                          id: slider.id,
                          title: slider.title,
                          subtitle: slider.subtitle,
                          buttonLabel: slider.buttonLabel,
                          href: slider.href,
                          desktopImage: slider.desktopImage,
                          mobileImage: slider.mobileImage,
                          sortOrder: String(slider.sortOrder),
                          active: slider.active
                        })
                      }
                    >
                      <Pencil size={16} />
                    </button>
                    <button className="icon-button dark" type="button" onClick={() => remove(slider)}>
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
