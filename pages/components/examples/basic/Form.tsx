import Checkbox from '@/components/inputs/Checkbox';
import ImageUpload from '@/components/inputs/ImageUpload';
import Slider from '@/components/inputs/Slider';
import { projectionType } from '@/scripts/examples/basic/projection';
import type { FC } from 'react';
import { useCallback, useContext } from 'react';
import { OptionsContext, textureGallery } from './Options';

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
  const setWidth = useCallback((width: number) => setSegment(([_, height]) => [width, height]), [setSegment]),
    setHeight = useCallback((height: number) => setSegment(([width, _]) => [width, height]), [setSegment]),
    setLat = useCallback((lat: number) => setPos(([_, lon]) => [lat, lon]), [setPos]),
    setLon = useCallback((lon: number) => setPos(([lat, _]) => [lat, lon]), [setPos]),
    setVisman = useCallback((visman: boolean) => setVis(([_, vispro]) => [visman, vispro]), [setVis]),
    setVispro = useCallback((vispro: boolean) => setVis(([visman, _]) => [visman, vispro]), [setVis]),
    setVisAll = useCallback((vis: boolean) => setVis((_) => [vis, vis]), [setVis]);

  return (
    <form onSubmit={(e) => e.preventDefault()} onReset={(e) => e.preventDefault()}>
      <div>
        <label>Segments</label>
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
      </div>
      <div>
        <label>Position</label>
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
      </div>
      <div>
        <label>Curvature</label>
        <Slider
          name={'kappa'}
          min={-1}
          max={+1}
          step={0}
          defaultValue={kappa}
          onChange={(event) => setKappa(parseFloat(event.target.value))}
        ></Slider>
      </div>
      <div>
        <label>Projection type</label>
        <select
          name={'type'}
          onChange={(event) => setProj(event.target.value as projectionType)}
          defaultValue={'equirectangular'}
        >
          <option value={'equirectangular'}>Equirectangular</option>
          <option value={'orthographic'}>Orthographic</option>
          <option value={'gnomonic'}>Gnomonic</option>
          <option value={'stereographic'}>Stereographic</option>
          <option value={'halfplane'}>Half plane</option>
          <option value={'hemisphere'}>Hemisphere</option>
        </select>
      </div>
      <div>
        <label>Visibility</label>
        <Checkbox
          name={'Projections'}
          child={[
            { name: 'Manifold', onChange: (event) => setVisman(event.target.checked), defaultChecked: visman },
            { name: 'Projection', onChange: (event) => setVispro(event.target.checked), defaultChecked: vispro },
          ]}
          onChange={(event) => setVisAll(event.target.checked)}
        ></Checkbox>
      </div>
      <div>
        <label>Texture selection</label>
        <ImageUpload
          width={400}
          height={200}
          defaultValue={textureURL}
          imageGallery={textureGallery}
          placeholder={'Upload a Texture'}
          changed={(url) => setTextureURL(url)}
        />
      </div>
    </form>
  );
};
export default AppInput;
