import type { FC, MouseEventHandler } from 'react';
import { useCallback, useContext } from 'react';
import { AspectImage, Box, Button, Card, Grid } from 'theme-ui';
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
      <Card>
        <Grid gap={2} columns={[2]}>
          {(props.imageGallery ?? []).map((url, ind) => (
            <Box key={ind} onClick={(event) => props.changed?.(url)}>
              <AspectImage src={url} alt={`Default ${ind}`} ratio={2 / 1} />
            </Box>
          ))}
        </Grid>
      </Card>
      <Button onClick={handleGalleryClose}>Close</Button>
    </>
  );
};

export default Gallery;
