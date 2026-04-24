import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScannerizzaQRCode() {
  const [risultato, setRisultato] = useState<string | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setRisultato(decodedText);
          scanner.stop();
        },
        () => {}
      )
      .catch(() => setErrore("Impossibile accedere alla fotocamera."));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-2xl font-bold">Scannerizza QR Code</h1>
      {!risultato && <div id="qr-reader" style={{ width: 300 }} />}
      {errore && <p className="text-red-500">{errore}</p>}
      {risultato && (
        <div className="text-center">
          <p className="text-green-600 font-semibold">QR rilevato!</p>
          <pre className="mt-2 text-sm bg-muted p-4 rounded">{risultato}</pre>
        </div>
      )}
    </div>
  );
}
