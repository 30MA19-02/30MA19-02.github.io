import { FC, ChangeEventHandler } from 'react';
import Checkbox from './input/Checkbox';
import ImageInput from './input/Image';
import Slider from './input/Slider';

interface property {
  height: number;
  width: number;
  lat: number;
  lon: number;
  dir: number;
  kappa: number;
  visman: boolean;
  vispro: boolean;
  texture: string;
  onChangeHeight?: ChangeEventHandler<HTMLInputElement>;
  onChangeWidth?: ChangeEventHandler<HTMLInputElement>;
  onChangeLat?: ChangeEventHandler<HTMLInputElement>;
  onChangeLon?: ChangeEventHandler<HTMLInputElement>;
  onChangeDir?: ChangeEventHandler<HTMLInputElement>;
  onChangeKappa?: ChangeEventHandler<HTMLInputElement>;
  onChangeVis?: ChangeEventHandler<HTMLInputElement>;
  onChangeVisMan?: ChangeEventHandler<HTMLInputElement>;
  onChangeVisPro?: ChangeEventHandler<HTMLInputElement>;
  onChangeTexture?: ChangeEventHandler<HTMLInputElement>;
}

const AppInput: FC<property> = (prop) => {
  return (
    <form>
      <label>Segments</label>
      <br />
      <Slider name={'height'} min={2} max={32} step={1} value={prop.height} onChange={prop.onChangeHeight}></Slider>
      <br />
      <Slider name={'width'} min={3} max={24} step={1} value={prop.width} onChange={prop.onChangeWidth}></Slider>
      <br />
      <label>Position</label>
      <br />
      <Slider name={'latitude'} min={-0.25} max={+0.25} step={0} value={prop.lat} onChange={prop.onChangeLat}></Slider>
      <br />
      <Slider name={'lontitude'} min={-0.5} max={+0.5} step={0} value={prop.lon} onChange={prop.onChangeLon}></Slider>
      <br />
      <Slider name={'direction'} min={-0.5} max={+0.5} step={0} value={prop.dir} onChange={prop.onChangeDir}></Slider>
      <br />
      <label>Curvature</label>
      <br />
      <Slider name={'kappa'} min={-1} max={+1} step={0} value={prop.kappa} onChange={prop.onChangeKappa}></Slider>
      <br />
      <label>Visibility</label>
      <br />
      <Checkbox
        name={'Projections'}
        child={[
          { name: 'Manifold', onChange: prop.onChangeVisMan, checked: prop.visman },
          { name: 'Projection', onChange: prop.onChangeVisPro, checked: prop.vispro },
        ]}
        onChange={prop.onChangeVis}
      ></Checkbox>
      <br />
      <label>Texture selection</label>
      <br />
      <ImageInput name={''} width={400} height={200} onChange={prop.onChangeTexture}></ImageInput>
    </form>
  );
};
export default AppInput;
