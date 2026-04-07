// ─── Replace with your Cloudinary cloud name & upload preset ─────
// Get from: https://cloudinary.com → Settings → Upload → Upload presets
const CLOUD_NAME    = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    '⚠️  Cloudinary credentials missing. Add REACT_APP_CLOUDINARY_CLOUD_NAME ' +
    'and REACT_APP_CLOUDINARY_UPLOAD_PRESET to your .env file.'
  );
}

/**
 * Upload a File or base64 dataURL to Cloudinary.
 * Returns the secure URL string.
 * @param {File|string} fileOrBase64
 * @param {string} folder  - Cloudinary folder (e.g. 'gallery' | 'members')
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(fileOrBase64, folder = 'gallery') {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary not configured. Check your .env file.');
  }

  const formData = new FormData();
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `bajrang-dal-eksar/${folder}`);

  if (typeof fileOrBase64 === 'string') {
    // base64 dataURL
    formData.append('file', fileOrBase64);
  } else {
    // File object
    formData.append('file', fileOrBase64);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return {
    url:      data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Returns a Cloudinary URL with transformations for optimized display.
 * @param {string} url - original Cloudinary URL
 * @param {number} width
 * @param {number} quality  0-100
 */
export function cloudinaryOptimized(url, width = 800, quality = 85) {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Insert transformation before /upload/
  return url.replace(
    '/upload/',
    `/upload/w_${width},q_${quality},f_auto/`
  );
}
