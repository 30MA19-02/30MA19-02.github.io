import { createRef, useState, useCallback, useContext } from 'react';
import { AspectImage, Field, Button, Card, Grid, Box, Input } from 'theme-ui';
import type { ChangeEventHandler, FC, InputHTMLAttributes, MouseEventHandler } from 'react';
import { OptionsContext } from '.';

interface property {
  changed?: (value: string) => void;
  placeholder?: string;
}
const Initial: FC<property> = (props) => {
  const { setMainState } = useContext(OptionsContext)!;
  const handleUploadClick: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const file = event.target.files![0]!;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async function (event: ProgressEvent<FileReader>) {
        await props.changed?.(reader.result as string);
      }.bind(this);
    },
    [props],
  );
  const handleSearchClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setMainState('search');
    },
    [setMainState],
  );
  const handleGalleryClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setMainState('gallery');
    },
    [setMainState],
  );
  return (
    <>
      <Input
        accept="image/*"
        id="contained-button-file"
        type="file"
        onChange={handleUploadClick}
        placeholder={props.placeholder}
      />
      <Button type="button" onClick={handleSearchClick}>
        Search
      </Button>
      <Button type="button" onClick={handleGalleryClick}>
        Gallery
      </Button>
    </>
  );
};

export default Initial;
