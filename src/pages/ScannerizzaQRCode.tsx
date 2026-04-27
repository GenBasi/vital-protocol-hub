import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/integrations/supabase/client";
import { decrementReagent } from "@/lib/reagents-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getReagentStatus } from "@/data/reagents";
import { ReagentStatusBadge } from "@/components/ReagentStatusBadge";

export default function ScannerizzaQRCode() {
  const [scanning, setScanning] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  const [reattivo, setReattivo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scanning) return;
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop();
          setScanning(false);
          try {
            const parsed = JSON.parse(decodedText);
            const id = parsed.id;
            if (!id) throw new Error("QR non valido");
            const { data, error } = await supabase
              .from("reagents")
              .select("*")
              .eq("id", id)
              .single();
            if (error || !data) throw new Error("Reattivo non trovato");
            setReattivo(data);
          } catch {
            setErrore("QR non riconosciuto o reattivo non trovato.");
          }
        },
        () => {}
      )
      .catch(() => setErrore("Impossibile accedere alla fotocamera."));
    return () => { scanner.stop().catch(() => {}); };
  }, [scanning]);

  const handleUsa = async () => {
    if (!reattivo) return;
    setLoading(true);
    try {
      const aggiornato = await decrementReagent(reattivo.id);
      setReattivo({ ...reattivo, quantity: aggiornato.quantity });
      toast.success(`Giacenza aggiornata: ${aggiornato.quantity} ${aggiornato.unit} rimasti`);
    } catch (e: any) {
      toast.error(e.message ?? "Errore aggiornamento giacenza");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
      <h1 className="text-2xl font-bold">Scannerizza QR Code</h1>

      {scanning && (
        <>
          <p className="text-sm text-muted-foreground">Inquadra il QR code del reattivo</p>
          <div id="qr-reader" style={{ width: 300 }} />
        </>
      )}

      {errore && (
        <div className="text-center space-y-4">
          <p className="text-red-500">{errore}</p>
          <Button onClick={() => { setErrore(null); setScanning(true); }}>Riprova</Button>
        </div>
      )}

      {reattivo && !errore && (
        <div className="w-full max-w-sm border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{reattivo.icon}</span>
            <div>
              <p className="font-semibold text-lg">{reattivo.name}</p>
              <p className="text-xs text-muted-foreground font-mono">Lotto: {reattivo.lot_number}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Giacenza attuale</p>
              <p className="text-2xl font-bold">{reattivo.quantity} <span className="text-sm font-normal">{reattivo.unit}</span></p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Scadenza</p>
              <p className="font-medium">{new Date(reattivo.expiration_date).toLocaleDateString("it-IT")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleUsa}
              disabled={loading || reattivo.quantity <= 0}
            >
              {loading ? "Aggiornamento..." : reattivo.quantity <= 0 ? "Giacenza esaurita" : "➖ Usa reattivo (-1)"}
            </Button>
            <Button variant="outline" onClick={() => { setReattivo(null); setScanning(true); }}>
              Scansiona altro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}