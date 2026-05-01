import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Link2, QrCode } from "lucide-react";
import { toast } from "sonner";

export function MemorialQR({ url, personName }: { url: string; personName: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      margin: 2,
      width: 480,
      color: { dark: "#1E3A52", light: "#FFFFFF" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [url]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `memorial-${personName.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function copy() {
    navigator.clipboard.writeText(url).then(
      () => toast.success("Enlace copiado"),
      () => toast.error("No se pudo copiar"),
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
        <QrCode className="h-3.5 w-3.5" /> Comparte este memorial
      </div>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`Código QR del memorial de ${personName}`}
          width={200}
          height={200}
          className="mx-auto mt-4 h-48 w-48 rounded-lg border border-border"
        />
      ) : (
        <div className="mx-auto mt-4 h-48 w-48 animate-pulse rounded-lg bg-muted" />
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Imprime este QR en el recordatorio del funeral o en una placa conmemorativa.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={download}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110"
        >
          <Download className="h-3.5 w-3.5" /> Descargar
        </button>
        <button
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:text-primary"
        >
          <Link2 className="h-3.5 w-3.5" /> Copiar enlace
        </button>
      </div>
    </div>
  );
}
