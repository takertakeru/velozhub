import "@/components/veloz/veloz.css";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  initialVelozTheme,
  persistVelozTheme,
  velozCarUrl,
  VelozMark,
  type VelozTheme,
} from "@/components/veloz/brand";
import * as Ic from "@/components/veloz/icons";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

const features = [
  {
    icon: Ic.Car,
    title: "Who has it now",
    body: "A live banner answers the only question that matters, then lists today's trips at a glance.",
  },
  {
    icon: Ic.Calendar,
    title: "Plan the week",
    body: "See the whole family's bookings laid out so everyone can claim a slot without stepping on each other.",
  },
  {
    icon: Ic.CheckCircle,
    title: "Zero double-bookings",
    body: "Overlapping times are caught the moment you pick them, and the database refuses a real clash.",
  },
];

function RouteComponent() {
  const [theme, setTheme] = useState<VelozTheme>(initialVelozTheme);

  return (
    <div className="veloz surface" data-theme={theme}>
      <div className="landing">
        <nav className="landing-nav">
          <div className="brandrow">
            <VelozMark className="mark" /> VelozHub
          </div>
          <div className="sp" />
          <button
            type="button"
            className="icon-btn"
            aria-label="Toggle theme"
            onClick={() => {
              setTheme((t) => {
                const next = t === "dark" ? "light" : "dark";

                persistVelozTheme(next);

                return next;
              });
            }}
          >
            {theme === "dark" ? <Ic.Sun /> : <Ic.Moon />}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
        </nav>

        <main className="landing-main">
          <section className="hero">
            <div className="hero-content">
              <span className="hero-eyebrow">Household car, sorted</span>
              <h1>One Veloz. Five drivers. Zero double-bookings.</h1>
              <p className="lead">
                VelozHub is the shared calendar for your family&apos;s Toyota
                Veloz. See who has the car right now and book your slot in
                seconds.
              </p>
              <div className="hero-cta">
                <Link to="/login" className="btn btn-primary">
                  Sign in to book <Ic.Chevron />
                </Link>
              </div>
            </div>
            <img
              className="hero-car"
              src={velozCarUrl}
              alt="Toyota Veloz"
              aria-hidden="true"
            />
          </section>

          <div className="feature-grid">
            {features.map((f) => {
              const Icon = f.icon;

              return (
                <div className="feature" key={f.title}>
                  <div className="ic">
                    <Icon />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="landing-foot">
          One shared car, five drivers, one calendar. VelozHub.
        </footer>
      </div>
    </div>
  );
}
