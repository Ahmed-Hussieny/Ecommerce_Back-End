import QRCode from 'qrcode';
export const generateQrCode = async (data) => {
    const qrCode = QRCode.toDataURL(JSON.stringify(data),{errorCorrectionLevel:'H'});
    return qrCode;
};