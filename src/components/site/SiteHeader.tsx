import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-valderrama.png";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/obituarios", label: "Obituarios" },
  { to: "/cotizar", label: "Cotizar" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-prose flex h-16 items-center justify-between gap-4 md:h-18">
        <Link to="/" className="flex items-center gap-2" aria-label="Funeraria Valderrama - Inicio">
          <img
            src={logo}
            alt="Funeraria Valderrama"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 transition-all"
          />
        </Link>

        <nav className="hidden lg:block" aria-label="Principal">
          <ul className="flex items-center gap-7 text-sm">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-foreground/75 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary font-medium" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+56953900931"
            className="group flex items-center gap-2 text-sm"
            aria-label="Llamar a atención 24/7"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/8 text-primary">
              <Phone className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Atención 24/7
              </span>
              <span className="font-medium text-foreground">+56 9 5390 0931</span>
            </span>
          </a>
          <a
            href="https://wa.me/56953900931?text=Hola%2C%20necesito%20ayuda"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-medium text-whatsapp-foreground shadow-soft transition hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "lg:hidden border-t border-border/70 overflow-hidden transition-[max-height] duration-300",
          open ? "max-h-[480px]" : "max-h-0",
        )}
      >
        <nav className="container-prose py-4" aria-label="Móvil">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-base text-foreground/80"
                  activeProps={{ className: "text-primary font-medium" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3">
            <a
              href="tel:+56953900931"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm"
            >
              <Phone className="h-4 w-4" /> +56 9 5390 0931 · 24/7
            </a>
            <a
              href="https://wa.me/56953900931"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-whatsapp px-3 py-2.5 text-sm font-medium text-whatsapp-foreground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}