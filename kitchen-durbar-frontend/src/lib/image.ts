const MAX_DIMENSION = 2000
const SKIP_BELOW_BYTES = 1024 * 1024

/**
 * Shrinks a picked photo before it's uploaded. Straight-off-the-phone photos
 * are often 5-15MB, which is slow to push through the backend to Cloudinary
 * (risking the request timeout) and can exceed Cloudinary's free-plan 10MB
 * per-image limit. Anything the browser can't decode (e.g. HEIC on Chrome),
 * GIFs/SVGs, and files that are already small are returned untouched.
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size < SKIP_BELOW_BYTES || !file.type.startsWith('image/') || /gif|svg/.test(file.type)) {
    return file
  }
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    // PNGs may carry transparency (logos) - WebP keeps it, JPEG wouldn't.
    const type = file.type === 'image/png' ? 'image/webp' : 'image/jpeg'
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))
    if (!blob || blob.size >= file.size) return file

    const ext = type === 'image/webp' ? 'webp' : 'jpg'
    const name = file.name.replace(/\.[^.]+$/, '') + `.${ext}`
    return new File([blob], name, { type })
  } catch {
    return file
  }
}
