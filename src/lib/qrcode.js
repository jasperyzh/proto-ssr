import QRCode from 'qrcode';

export async function generateQRCode(data) {
  try {
    const url = await QRCode.toDataURL(data);
    return url;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return null;
  }
}