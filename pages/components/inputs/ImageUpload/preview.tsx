import type React from 'react';
import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface Property extends ImageProps {
  ratio?: number;
}

const Preview: React.FC<Property> = (props = {
  alt: 'Selected Image',
  src: '',
  ratio: 2 / 1,
}) => {
  return (
    <>
      <div
        style={{
          aspectRatio: '2 / 1',
        }}
      >
        <Image
          {...props}
          alt={props.alt!}
          style={{
            objectFit: 'cover',
          }}
          width={'100%'}
          height={'100%'}
        />
      </div>
    </>
  );
};

export default Preview;
