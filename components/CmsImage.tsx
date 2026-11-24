import Image, { type ImageProps } from 'next/image';

// next/image for photos chosen in the CMS. Uploaded photos (data: URLs) and pasted links from
// other sites skip Next's optimiser, which only handles files in /public.
export default function CmsImage(props: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : '';
  const external = src.startsWith('data:') || /^https?:\/\//.test(src);
  return <Image {...props} unoptimized={external || props.unoptimized} alt={props.alt}/>;
}
