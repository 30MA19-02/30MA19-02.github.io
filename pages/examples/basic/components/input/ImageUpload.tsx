// imports the React Javascript Library
import { createRef, useState } from 'react';
import { AspectImage, Field, Button, Card, Grid, Box, Input } from 'theme-ui';
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
        <Input
          accept="image/*"
          id="contained-button-file"
          type="file"
          onChange={handleUploadClick}
          placeholder={props.placeholder}
        />
        <Button type="button" onClick={handleSearchClick}>Search</Button>
        <Button type="button" onClick={handleGalleryClick}>Gallery</Button>
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
      <>
        <Field type={'url'} label={'Image URL'} ref={input} />
        <Button type="button" onClick={(event) => handleImageSearch(input.current!.value)}>Search</Button>
        <Button type="button" onClick={handleSeachClose}>Close</Button>
      </>
    );
  };
  const renderGalleryState = () => {
    const handleAvatarClick = upload;
    const handleGalleryClose: MouseEventHandler<HTMLButtonElement> = (event) => {
      setMainState('initial');
    };

    return (
      <>
        <Card>
          <Grid gap={2} columns={[2]}>
          {
            props.imageGallery!.map((url, ind) => (
              <Box
              key={ind}
              onClick={(event) => handleAvatarClick(url)}
              >
                <AspectImage src={url} alt={`Default ${ind}`} ratio={2/1} />
              </Box>
            ))
          }
          </Grid>
        </Card>
        <Button onClick={handleGalleryClose}>Close</Button>
      </>
    );
  };
  const renderPreview = () => {
    return (
      <>
        <>
          {selectedFile ? (
            <Card>
              <AspectImage src={selectedFile} alt={'Selected Image'} ratio={2/1} />
            </Card>
          ) : (
            <>{props.children}</>
          )}
        </>
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
};

export default ImageUploadCard;
