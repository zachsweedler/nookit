export default function localLoader({ src, quality }) {
    // For other images, simply return the Supabase image URL
    return `${src}?quality=${
      quality || 76
    }`;
  }
  