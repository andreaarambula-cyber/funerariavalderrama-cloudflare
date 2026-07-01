import { useState } from "react";
import { Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateMemorialStory, type MemorialCardArgs } from "@/lib/memorialCard";

export function MemorialShareImage(props: MemorialCardArgs) {
  const [busy, setBusy] = useState(false);

  const share = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await generateMemorialStory(props);
      const slug = props.fullName.toLowerCase().replace(/\s+/g, "-");
      const file = new File([blob], `memorial-${slug}.png`, { type: "image/png" });

      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };

      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: `En memoria de ${props.fullName}`,
          text: `En memoria de ${props.fullName} — ${props.url}`,
        });
      } else {
        // Escritorio o sin soporte: descarga la imagen para subirla a Instagram.
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        toast.success("Imagen descargada", {
          description: "Súbela como Historia en Instagram o compártela donde quieras.",
        });
      }
    } catch (err) {
      // El usuario canceló el menú de compartir: no es un error.
      if ((err as Error)?.name !== "AbortError") {
        toast.error("No se pudo generar la imagen para compartir.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={share}
      disabled={busy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
      {busy ? "Preparando imagen…" : "Compartir memorial (Instagram, WhatsApp…)"}
    </button>
  );
}
