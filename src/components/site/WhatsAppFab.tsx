import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/56953900931?text=Hola%2C%20necesito%20ayuda%20con%20un%20servicio%20funerario"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elevated transition hover:scale-105 md:bottom-7 md:right-7"
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40"
      />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}