import Image from 'next/image';
import { ChangeEventHandler, FC, Fragment, InputHTMLAttributes, useState } from 'react';

interface property extends InputHTMLAttributes<HTMLInputElement> {}

const ImageInput: FC<property> = (prop) => {
  const [url, setURL] = useState<string>(prop.value as string);

  const onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!event.target.files) return;
    let image_ = event.target.files.item(0);
    if(!image_) return;
    setURL(URL.createObjectURL(image_));
    prop.onChange?.call(undefined, event);
  };
  let { type: _, ...prop_ } = prop;
  prop_.onChange = onChange;

  return (
    <Fragment>
      <label>{prop.name}</label>
      <input type={'file'} accept={'image/*'} minLength={1} maxLength={1} {...prop_}></input>
      <div>
        {url? <Image src={url} alt={'uploaded image'} width={prop.width} height={prop.height}></Image> : <Fragment></Fragment>}
      </div>
    </Fragment>
  );
};

export default ImageInput;
