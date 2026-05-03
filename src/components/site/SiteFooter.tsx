import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Facebook } from "lucide-react";
import logo from "@/assets/logo-valderrama.png";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground/90">
      <div className="container-prose grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="Funeraria Valderrama"
              className="h-24 w-auto"
              style={{ filter: "invert(1) brightness(1.5)" }}
            />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            Acompañamos a las familias chilenas en el momento más difícil con dignidad,
            transparencia y cercanía. Más de 30 años de experiencia.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.facebook.com/people/Funeraria-Valderrama/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Funeraria Valderrama"
              className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/20 transition hover:bg-primary-foreground/10"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <FooterCol title="Servicios">
          <FooterLink to="/servicios">Servicio funerario</FooterLink>
          <FooterLink to="/servicios">Cremación</FooterLink>
          <FooterLink to="/servicios">Velatorios</FooterLink>
          <FooterLink to="/servicios">Traslados</FooterLink>
          <FooterLink to="/planes">Plan a futuro</FooterLink>
        </FooterCol>

        <FooterCol title="Compañía">
          <FooterLink to="/nosotros">Nosotros</FooterLink>
          <FooterLink to="/obituarios">Obituarios</FooterLink>
          <FooterLink to="/cotizar">Cotización online</FooterLink>
          <FooterLink to="/contacto">Contacto</FooterLink>
        </FooterCol>

        <FooterCol title="Contacto 24/7">
          <li className="flex items-start gap-2.5 text-sm text-primary-foreground/75">
            <Phone className="mt-0.5 h-4 w-4 text-accent" />
            <a href="tel:+56953900931" className="hover:text-primary-foreground">
              +56 9 5390 0931
            </a>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-primary-foreground/75">
            <Mail className="mt-0.5 h-4 w-4 text-accent" />
            <a href="mailto:contacto@valderrama.cl" className="hover:text-primary-foreground">
              contacto@valderrama.cl
            </a>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-primary-foreground/75">
            <MapPin className="mt-0.5 h-4 w-4 text-accent" />
            <span>O'Higgins 1601, esq. Galvarino, Concepción</span>
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-prose flex flex-col gap-3 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} Funeraria Valderrama. Todos los derechos reservados.</p>
          <p>Empresa registrada SEREMI de Salud · Resolución N° 0123/2018</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-foreground">Privacidad</a>
            <a href="#" className="hover:text-primary-foreground">Cookies</a>
            <a href="#" className="hover:text-primary-foreground">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {title}
      </h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-primary-foreground/75 transition hover:text-primary-foreground"
      >
        {children}
      </Link>
    </li>
  );
}