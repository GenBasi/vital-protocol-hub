import { QRCodeSVG } from "qrcode.react";

export default function GeneraQRCode() {
  const qrValue = JSON.stringify({
    app: "LabFlow",
    laboratorio: "Lab principale",
    admin: "Master Admin",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-2xl font-bold">Genera QR Code</h1>
      <QRCodeSVG value={qrValue} size={220} />
      <p className="text-sm text-muted-foreground">QR Code del laboratorio</p>
    </div>
  );
}