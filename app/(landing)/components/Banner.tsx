'use client'

import Image from 'next/image';
import React from 'react'

const Banner = () => {
  return (
    <Image
      src="/banner.svg"
      alt="banner"
      width={1280}
      height={360}
      className="object-cover w-full h-auto mt-4"
    />
  );
}

export default Banner