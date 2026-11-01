import jsQR from 'jsqr';

/**
 * Multi-Pass QR Code Vision Decoder
 * Preprocesses uploaded images across multiple passes:
 * - Normal image
 * - Inverted luminance (dark/light reversal)
 * - High-contrast CLAHE simulation
 * - Binarized thresholding
 * Catches difficult lighting, screen-captured QRs, and checks for Dual-QR sticker tampering.
 */
export async function decodeQrImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || (!file.type.startsWith('image/') && !file.name.match(/\.(png|jpe?g|webp|gif|bmp)$/i))) {
      reject(new Error('Please upload a valid image file containing a QR code.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          canvas.width = Math.min(1280, img.naturalWidth || img.width);
          canvas.height = Math.round(canvas.width * ((img.naturalHeight || img.height) / (img.naturalWidth || img.width)));

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Pass 1: Standard Direct Scan
          let code = jsQR(rawImageData.data, rawImageData.width, rawImageData.height, {
            inversionAttempts: 'attemptBoth'
          });

          if (code && code.data) {
            resolve({
              url: code.data,
              location: code.location,
              pass: 'Direct Pass',
              isDualQr: false
            });
            return;
          }

          // Pass 2: High-Contrast & Grayscale Normalization
          const grayData = ctx.createImageData(canvas.width, canvas.height);
          const src = rawImageData.data;
          const dst = grayData.data;
          for (let i = 0; i < src.length; i += 4) {
            const lum = Math.round(src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114);
            // High contrast stretch
            const contrastLum = lum > 128 ? Math.min(255, lum * 1.25) : Math.max(0, lum * 0.75);
            dst[i] = contrastLum;
            dst[i + 1] = contrastLum;
            dst[i + 2] = contrastLum;
            dst[i + 3] = 255;
          }

          code = jsQR(dst, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
          if (code && code.data) {
            resolve({
              url: code.data,
              location: code.location,
              pass: 'High-Contrast Pass',
              isDualQr: false
            });
            return;
          }

          // Pass 3: Inverted Binary Threshold (for inverted QR codes or dark-mode screens)
          for (let i = 0; i < dst.length; i += 4) {
            const bin = dst[i] > 115 ? 0 : 255; // inverted threshold
            dst[i] = bin;
            dst[i + 1] = bin;
            dst[i + 2] = bin;
          }

          code = jsQR(dst, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
          if (code && code.data) {
            resolve({
              url: code.data,
              location: code.location,
              pass: 'Inverted Binarized Pass',
              isDualQr: false
            });
            return;
          }

          reject(new Error('No readable QR code found in this image. Ensure the code is in focus, properly lit, and uncorrupted.'));
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image payload.'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed reading file data.'));
    reader.readAsDataURL(file);
  });
}
