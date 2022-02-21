import { ChangeEventHandler } from 'react';

import type { NextPage } from 'next';

import { Slider, Checkbox, ImageInput } from './input';

interface property {
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

const AppInput: NextPage<property> = (prop) => {
  return (
    <form>
      <label>Segments</label>
      <br />
      <Slider name={'height'} min={2} max={32} step={1} value={32} onChange={prop.onChangeHeight}></Slider>
      <br />
      <Slider name={'width'} min={3} max={24} step={1} value={24} onChange={prop.onChangeWidth}></Slider>
      <br />
      <label>Position</label>
      <br />
      <Slider
        name={'latitude'}
        min={-0.25}
        max={+0.25}
        step={0}
        value={0.03815754722}
        onChange={prop.onChangeLat}
      ></Slider>
      <br />
      <Slider
        name={'lontitude'}
        min={-0.5}
        max={+0.5}
        step={0}
        value={0.27923107222}
        onChange={prop.onChangeLon}
      ></Slider>
      <br />
      <Slider name={'direction'} min={-0.5} max={+0.5} step={0} value={0} onChange={prop.onChangeDir}></Slider>
      <br />
      <label>Curvature</label>
      <br />
      <Slider name={'kappa'} min={-1} max={+1} step={0} value={1} onChange={prop.onChangeKappa}></Slider>
      <br />
      <label>Visibility</label>
      <br />
      <Checkbox
        name={'Projections'}
        child={[
          { name: 'Manifold', onChange: prop.onChangeVisMan, checked: true },
          { name: 'Projection', onChange: prop.onChangeVisPro, checked: true },
        ]}
        onChange={prop.onChangeVis}
      ></Checkbox>
      <br/>
      <ImageInput name={'texture'} width={400} height={200} onChange={prop.onChangeTexture}></ImageInput>
    </form>
  );
};
export default AppInput;
