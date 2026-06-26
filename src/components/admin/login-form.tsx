"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
    });

    setLoading(false);
    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="login-box admin-form" onSubmit={submit}>
      <div>
        <span className="eyebrow">Admin panel</span>
        <h1 style={{ margin: "8px 0 4px" }}>BuildPro.lk</h1>
        <p className="section-copy" style={{ margin: 0 }}>
          Login to manage products, orders, sliders, and reviews.
        </p>
      </div>
      <label className="label">
        Email
        <input className="field" name="email" type="email" required />
      </label>
      <label className="label">
        Password
        <input className="field" name="password" type="password" required />
      </label>
      {error && <p className="notice">{error}</p>}
      <button className="btn primary full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
