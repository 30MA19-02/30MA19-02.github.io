import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useCallback, useContext } from 'react';
import { Button, Input } from 'theme-ui';
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
