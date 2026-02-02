import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import crypto from "crypto";

const CARD_NUMBER = "V00347833";
const DEVICE_ID = "8d20fc96-1b0e-4982-8292-e97caed114ec";

function generateHash(cardNr, guid, iat, deviceId) {
  const dataToHash = cardNr + guid + iat + deviceId;
  const hash = crypto.createHash("sha256").update(dataToHash).digest("hex");
  const hashLast8 = hash.slice(-8).toUpperCase();
  return hashLast8;
}

export default function BasicFitQr() {
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Math.floor(Date.now() / 1000);
      const hash = generateHash(CARD_NUMBER, "2L8", timestamp, DEVICE_ID);
      const data = `GM2:${CARD_NUMBER}:2L8:${timestamp}:${hash}`;
      setQrData(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>QR Code Basic-Fit</h3>
      {qrData && <QRCode value={qrData} size={180} />}
    </div>
  );
}