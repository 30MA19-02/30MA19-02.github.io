import Image from 'next/image';
import { useCallback, useState } from 'react';
import type { ChangeEventHandler, FC, InputHTMLAttributes } from 'react';

interface property extends InputHTMLAttributes<HTMLInputElement> {}

const ImageInput: FC<property> = (prop) => {
  const [url, setURL] = useState(prop.defaultValue as string);
  const [upd, setUpd] = useState(false);
  

  const onChangeFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!event.target.files) return;
    let image_ = event.target.files.item(0);
    if (!image_) return;
    const url = URL.createObjectURL(image_);
    setURL(url);
    setUpd(true);
  };
  const onChangeURL: ChangeEventHandler<HTMLInputElement> = async (event) => {
    try{
      const res = await fetch(event.target.value);
      const buff = await res.blob();
      if(!buff.type.startsWith('image/')) throw new Error("Not an image");
    }catch(e){
      if (upd) {event.target.value = url; setUpd(false);}
      else return;
    }
    setURL(event.target.value);
    prop.onChange?.call(undefined, event);
  };

  return (
    <>
      <label>{prop.name}</label>
      <input type={'file'} accept={'image/*'} minLength={1} maxLength={1} onChange={onChangeFile} placeholder={prop.placeholder}/>
      <br/>
      <input type={'url'} defaultValue={url} onChange={onChangeURL}/>
      <br/>
      <Image src={url} alt={'uploaded image'} width={prop.width} height={prop.height}/>
    </>
  );
};

export default ImageInput;
