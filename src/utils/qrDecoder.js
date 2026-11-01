import jsQR from 'jsqr';

/**
 * Decodes a QR code from an uploaded Image File
 * Uses an off-screen HTML5 Canvas and jsQR to extract the embedded string / payload
 */
export async function decodeQrImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please upload a valid image file containing a QR code.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });

          if (code && code.data) {
            resolve({
              url: code.data,
              location: code.location
            });
          } else {
            // Attempt with scaled down / resized canvas for high resolution mobile camera photos
            if (canvas.width > 1200 || canvas.height > 1200) {
              const maxDim = 800;
              const scale = maxDim / Math.max(canvas.width, canvas.height);
              const smallCanvas = document.createElement('canvas');
              smallCanvas.width = Math.round(canvas.width * scale);
              smallCanvas.height = Math.round(canvas.height * scale);
              const smallCtx = smallCanvas.getContext('2d');
              smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
              
              const smallData = smallCtx.getImageData(0, 0, smallCanvas.width, smallCanvas.height);
              const secondAttempt = jsQR(smallData.data, smallData.width, smallData.height, {
                inversionAttempts: 'attemptBoth'
              });
              
              if (secondAttempt && secondAttempt.data) {
                resolve({
                  url: secondAttempt.data,
                  location: secondAttempt.location
                });
                return;
              }
            }
            reject(new Error('No readable QR code found in this image. Ensure the code is in focus and well lit.'));
          }
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

