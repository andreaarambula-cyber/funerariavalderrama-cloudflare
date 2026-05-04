import { useEffect, useState } from "react";
import { Clock, Phone, MessageCircle, MapPin } from "lucide-react";

const messages = [
  { icon: Clock, text: "Atención 24/7" },
  { icon: Phone, text: "+56 9 5390 0931" },
  { icon: MessageCircle, text: "WhatsApp inmediato" },
  { icon: MapPin, text: "Gran Concepción" },
] as const;

export function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, []);

  const { icon: Icon, text } = messages[i];

  return (
    <div className="border-b border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="container-prose flex h-9 items-center justify-center overflow-hidden text-[11px] font-medium uppercase tracking-[0.14em] sm:text-[12px] sm:tracking-[0.18em]">
        <div
          key={i}
          className="flex animate-fade-in items-center gap-2.5 whitespace-nowrap"
          aria-live="polite"
        >
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <Icon className="h-3.5 w-3.5 text-accent" />
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
