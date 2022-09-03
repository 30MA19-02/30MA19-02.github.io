import type { FC } from 'react';
import type { AspectImageProps } from 'theme-ui';
import { AspectImage, Card } from 'theme-ui';

interface property extends AspectImageProps {}
const Preview: FC<property> = (props) => {
  return (
    <>
      <Card>
        <AspectImage {...props} />
      </Card>
    </>
  );
};

Preview.defaultProps = {
  alt: 'Selected Image',
  ratio: 2 / 1,
};

export default Preview;
