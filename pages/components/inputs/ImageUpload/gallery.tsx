import Image from 'next/image';
import type { FC, MouseEventHandler } from 'react';
import { useCallback, useContext } from 'react';
import { OptionsContext } from '.';

interface property {
  imageGallery?: string[];
  changed?: (value: string) => void;
}
const Gallery: FC<property> = (props) => {
  const { setMainState } = useContext(OptionsContext)!;
  const handleGalleryClose: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setMainState('initial');
    },
    [setMainState],
  );

  return (
    <>
      <div>
        <div>
          {(props.imageGallery ?? []).map((url, ind) => (
            <div
              key={ind}
              onClick={(event) => props.changed?.(url)}
              style={{
                aspectRatio: '2 / 1',
              }}
            >
              <Image
                alt={`Default ${ind}`}
                src={url}
                style={{
                  objectFit: 'cover',
                }}
                width={'100%'}
                height={'100%'}
              />
            </div>
          ))}
        </div>
      </div>
      <button type={'button'} onClick={handleGalleryClose}>Close</button>
    </>
  );
};

export default Gallery;
