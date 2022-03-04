// imports the React Javascript Library
import { createRef, useState } from 'react';
import Image from 'next/image';
import type { ChangeEventHandler, FC, InputHTMLAttributes, MouseEventHandler } from 'react';

interface property extends InputHTMLAttributes<HTMLInputElement> {
  imageGallery?: string[];
  changed?: (value: string) => void;
}

const ImageUploadCard: FC<property> = (props) => {
  type state = 'initial' | 'search' | 'gallery' | 'uploaded';
  const [mainState, setMainState] = useState<state>('initial');
  const [selectedFile, setSelectedFile] = useState<string>(props.defaultValue as string);
  const checkImage = async (url: string) => {
    try {
      const res = await fetch(url);
      const buff = await res.blob();
      if (!buff.type.startsWith('image/')) throw new Error(`not an image (${buff.type})`);
    } catch (error) {
      return false;
    }
    return true;
  };
  const upload = async (url: string) => {
    if (!(await checkImage(url))) return;
    props.changed?.call(undefined, url);
    setSelectedFile(url);
    setMainState('initial');
  };
  const renderInitialState = () => {
    const handleUploadClick: ChangeEventHandler<HTMLInputElement> = (event) => {
      const file = event.target.files![0]!;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async function (event: ProgressEvent<FileReader>) {
        await upload(reader.result as string);
      }.bind(this);
    };
    const handleSearchClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      setMainState('search');
    };
    const handleGalleryClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      setMainState('gallery');
    };
    return (
      <>
        <input
          accept="image/*"
          id="contained-button-file"
          type="file"
          onChange={handleUploadClick}
          placeholder={props.placeholder}
        />
        <button onClick={handleSearchClick}>Search</button>
        <button onClick={handleGalleryClick}>Gallery</button>
      </>
    );
  };
  const renderSearchState = () => {
    const handleImageSearch = upload;
    const handleSeachClose: MouseEventHandler<HTMLButtonElement> = (event) => {
      setMainState('initial');
    };
    const input = createRef<HTMLInputElement>();
    return (
      <div>
        <input type={'url'} placeholder="Image URL" ref={input} />
        <button onClick={(event) => handleImageSearch(input.current!.value)}>Search</button>
        <button onClick={handleSeachClose}>Close</button>
      </div>
    );
  };
  const renderGalleryState = () => {
    const handleAvatarClick = upload;
    const handleGalleryClose: MouseEventHandler<HTMLButtonElement> = (event) => {
      setMainState('initial');
    };
    const listItems = props.imageGallery!.map((url, ind) => (
      <li key={ind}>
        <a
          onClick={(event) => handleAvatarClick(url)}
          style={{
            padding: '5px 5px 5px 5px',
            cursor: 'pointer',
          }}
        >
          <Image src={url} alt={`Default ${ind}`} width={100} height={100} />
        </a>
      </li>
    ));

    return (
      <>
        <ul>{listItems}</ul>
        <button onClick={handleGalleryClose}>Close</button>
      </>
    );
  };
  const renderPreview = () => {
    return (
      <>
        <div>
          {selectedFile ? <Image src={selectedFile} alt={'Selected Image'} width={props.width} height={props.height} /> : <>{props.children}</>}
        </div>
      </>
    );
  };
  return (
    <div>
      {(mainState === 'initial' && renderInitialState()) ||
        (mainState === 'search' && renderSearchState()) ||
        (mainState === 'gallery' && renderGalleryState())}
      {renderPreview()}
    </div>
  );
};

ImageUploadCard.defaultProps = {
  imageGallery: [],
  width: 100,
  height: 100,
};

export default ImageUploadCard;
