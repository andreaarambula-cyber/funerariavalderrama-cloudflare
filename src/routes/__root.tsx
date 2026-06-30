import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";

import appCss from "../styles.css?url";

// Dominio canónico del sitio. Al migrar a un dominio propio (ej. https://funerariavalderrama.cl),
// cambiar SOLO esta línea: alimenta canonical, og:url, sitemap y JSON-LD.
export const SITE_URL = "https://funerariavalderrama.lovable.app";

const FUNERAL_HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  name: "Funeraria Valderrama",
  description:
    "Servicios funerarios con dignidad en el Gran Concepción. Atención 24/7, planes a futuro y obituarios online.",
  url: SITE_URL,
  telephone: "+56953900931",
  email: "funerariavalderramaspa@gmail.com",
  image: `${SITE_URL}/favicon.ico`,
  areaServed: { "@type": "Place", name: "Gran Concepción, Región del Biobío, Chile" },
  address: { "@type": "PostalAddress", addressRegion: "Biobío", addressCountry: "CL" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Funeraria Valderrama — Acompañamos a tu familia 24/7 en el Gran Concepción" },
      {
        name: "description",
        content:
          "Servicios funerarios con dignidad en el Gran Concepción. Atención 24/7, planes a futuro y obituarios online. Más de 28 años acompañando familias.",
      },
      { name: "author", content: "Funeraria Valderrama" },
      { name: "theme-color", content: "#1A1A1A" },
      { property: "og:title", content: "Funeraria Valderrama — Acompañamos a tu familia 24/7 en el Gran Concepción" },
      {
        property: "og:description",
        content:
          "Acompañamos a tu familia en el momento más difícil. Servicio funerario y planes a futuro en el Gran Concepción.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Funeraria Valderrama — Acompañamos a tu familia 24/7 en el Gran Concepción" },
      {
        name: "twitter:description",
        content:
          "Acompañamos a tu familia en el momento más difícil. Servicio funerario y planes a futuro en el Gran Concepción.",
      },
      { property: "og:locale", content: "es_CL" },
      { property: "og:site_name", content: "Funeraria Valderrama" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/781951dc-0398-4823-b0ec-aada83db29b2/id-preview-e01e4ee3--aa0c1194-590a-4958-b566-0ad45fb6e5a6.lovable.app-1777932698494.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/781951dc-0398-4823-b0ec-aada83db29b2/id-preview-e01e4ee3--aa0c1194-590a-4958-b566-0ad45fb6e5a6.lovable.app-1777932698494.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(FUNERAL_HOME_JSONLD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  // El panel /admin usa su propio layout (sin header/footer público).
  if (isAdmin) {
    return (
      <AuthProvider>
        <Outlet />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <AnnouncementBar />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <Toaster position="top-center" richColors />
      </div>
    </AuthProvider>
  );
}
