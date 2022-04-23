import Checkbox from './input/Checkbox';
import ImageUpload from './input/ImageUpload';
import Slider from './input/Slider';
import { OptionsContext, textureGallery } from './Options';
import { useContext } from 'react';
import type { FC } from 'react';
import { projectionType } from '../script/point';
import { Box, Flex, Label, Select } from 'theme-ui';

const AppInput: FC = (prop) => {
  const {
    segment: [width, height],
    setSegment,
    pos: [lat, lon],
    setPos,
    dir,
    setDir,
    kappa,
    setKappa,
    vis: [visman, vispro],
    setVis,
    textureURL,
    setTextureURL,
    proj,
    setProj,
  } = useContext(OptionsContext)!;
  const setWidth = (width: number) => setSegment([width, height]);
  const setHeight = (height: number) => setSegment([width, height]);
  const setLat = (lat: number) => setPos([lat, lon]);
  const setLon = (lon: number) => setPos([lat, lon]);
  const setVisman = (visman: boolean) => setVis([visman, vispro]);
  const setVispro = (vispro: boolean) => setVis([visman, vispro]);
  const setVisAll = (vis: boolean) => setVis([vis, vis]);

  return (
    <Flex
      as={'form'}
      onSubmit={(e) => e.preventDefault()}
      onReset={(e) => e.preventDefault()}
    >
      <Box>
      <Label>Segments</Label>
      <Slider
        name={'height'}
        min={2}
        max={32}
        step={1}
        defaultValue={height}
        onChange={(event) => setHeight(parseInt(event.target.value))}
      ></Slider>
      <Slider
        name={'width'}
        min={3}
        max={24}
        step={1}
        defaultValue={width}
        onChange={(event) => setWidth(parseInt(event.target.value))}
      ></Slider>
        <Label>Position</Label>
        <Slider
          name={'latitude'}
          min={-0.25}
          max={+0.25}
          step={0}
          defaultValue={lat}
          onChange={(event) => setLat(parseFloat(event.target.value))}
        ></Slider>
        <Slider
          name={'lontitude'}
          min={-0.5}
          max={+0.5}
          step={0}
          defaultValue={lon}
          onChange={(event) => setLon(parseFloat(event.target.value))}
        ></Slider>
        <Slider
          name={'direction'}
          min={-0.5}
          max={+0.5}
          step={0}
          defaultValue={dir}
          onChange={(event) => setDir(parseFloat(event.target.value))}
        ></Slider>
        <Label>Curvature</Label>
        <Slider
          name={'kappa'}
          min={-1}
          max={+1}
          step={0}
          defaultValue={kappa}
          onChange={(event) => setKappa(parseFloat(event.target.value))}
        ></Slider>
      </Box>
      <Box>
        <Label>Projection type</Label>
        <Select name={'type'} onChange={(event) => setProj(event.target.value as projectionType)} defaultValue={'equirectangular'}>
          <option value={'equirectangular'}>Equirectangular</option>
          <option value={'orthographic'}>Orthographic</option>
          <option value={'gnomonic'}>Gnomonic</option>
          <option value={'stereographic'}>Stereographic</option>
          <option value={'halfplane'}>Half plane</option>
          <option value={'hemisphere'}>Hemisphere</option>
        </Select>
        <Label>Visibility</Label>
        <Checkbox
          name={'Projections'}
          child={[
            { name: 'Manifold', onChange: (event) => setVisman(event.target.checked), defaultChecked: visman },
            { name: 'Projection', onChange: (event) => setVispro(event.target.checked), defaultChecked: vispro },
          ]}
          onChange={(event) => setVisAll(event.target.checked)}
        ></Checkbox>
      <Label>Texture selection</Label>
      <ImageUpload
        width={400}
        height={200}
        defaultValue={textureURL}
        imageGallery={textureGallery}
        placeholder={'Upload a Texture'}
        changed={(url) => setTextureURL(url)}
      />
      </Box>
    </Flex>
  );
};
export default AppInput;
