export default function supabaseLoader({ src, width, quality, islocal }) {
  const url = islocal ? new URL(`/${src}`) : new URL(`https://aocthgqmtpklqubodylf.supabase.co/storage/v1/object/public/${src}`)
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}