/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image'

const UnoptimizedImage = (props: any) => {
  return <Image {...props} unoptimized />
}

export default UnoptimizedImage
