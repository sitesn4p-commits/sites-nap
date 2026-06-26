"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_SLIDES } from "@/lib/constants";
import type { Slider } from "@/types";

export function HomeSlider({ sliders }: { sliders: Slider[] }) {
  const slides = useMemo(() => (sliders.length ? sliders : DEFAULT_SLIDES), [sliders]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const move = (direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="hero" aria-label="Featured products">
      <div className="hero-track">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`hero-slide ${index === active ? "active" : ""}`}>
            <picture>
              <source media="(max-width: 720px)" srcSet={slide.mobileImage || slide.desktopImage} />
              <img src={slide.desktopImage || "/assets/hero-desktop.png"} alt={slide.title} />
            </picture>
          </div>
        ))}
      </div>
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow">Computer Parts Store</span>
          <h1>{slides[active]?.title}</h1>
          <p>{slides[active]?.subtitle}</p>
          <Link className="btn primary" href={slides[active]?.href || "/products"}>
            {slides[active]?.buttonLabel || "Shop Products"}
          </Link>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="hero-controls">
          <button className="icon-button" type="button" onClick={() => move(-1)} aria-label="Previous slide">
            <ChevronLeft size={18} />
          </button>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`dot ${index === active ? "active" : ""}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          <button className="icon-button" type="button" onClick={() => move(1)} aria-label="Next slide">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
