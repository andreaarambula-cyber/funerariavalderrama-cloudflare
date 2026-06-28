import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
          "Servicios funerarios y de cremación con dignidad en el Gran Concepción. Atención 24/7, planes a futuro y obituarios online. Más de 28 años acompañando familias.",
      },
      { name: "author", content: "Funeraria Valderrama" },
      { name: "theme-color", content: "#1A1A1A" },
      { property: "og:title", content: "Funeraria Valderrama — Acompañamos a tu familia 24/7 en el Gran Concepción" },
      {
        property: "og:description",
        content:
          "Acompañamos a tu familia en el momento más difícil. Servicio funerario, cremación y planes a futuro en el Gran Concepción.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Funeraria Valderrama — Acompañamos a tu familia 24/7 en el Gran Concepción" },
      { name: "description", content: "A modern, dignified funeral home website for Chile, offering services, plans, and obituaries." },
      { property: "og:description", content: "A modern, dignified funeral home website for Chile, offering services, plans, and obituaries." },
      { name: "twitter:description", content: "A modern, dignified funeral home website for Chile, offering services, plans, and obituaries." },
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
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
  return (
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
  );
}
