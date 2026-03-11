import Image, { type ImageProps } from "next/image"

export default function SafeImage(props: ImageProps) {
  return (
    <Image
      {...props}
      width={props.width ?? 400}
      height={props.height ?? 225}
      sizes="(max-width: 768px) 100vw, 400px"
      loading="lazy"
      unoptimized
    />
  )
}
