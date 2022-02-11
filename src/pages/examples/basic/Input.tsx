import { ChangeEventHandler, FC } from 'react';

import { Slider, Checkbox }from "src/components/input";
interface property{
    onChangeHeight?: ChangeEventHandler<HTMLInputElement>;
    onChangeWidth?: ChangeEventHandler<HTMLInputElement>;
    onChangeLat?: ChangeEventHandler<HTMLInputElement>;
    onChangeLon?: ChangeEventHandler<HTMLInputElement>;
    onChangeDir?: ChangeEventHandler<HTMLInputElement>;
    onChangeKappa?: ChangeEventHandler<HTMLInputElement>;
    onChangeVis?: ChangeEventHandler<HTMLInputElement>;
    onChangeVisMan?: ChangeEventHandler<HTMLInputElement>;
    onChangeVisPro?: ChangeEventHandler<HTMLInputElement>;
}

const AppInput: FC<property> = (prop) => {
    return (
            <form>
                <label>Segments</label>
                <Slider name={"height"} min={2} max={32} step={1} value={32} onChange={prop.onChangeHeight}></Slider>
                <Slider name={"width"} min={3} max={24} step={1} value={24} onChange={prop.onChangeWidth}></Slider>
                <label>Position</label>
                <Slider name={"latitude"} min={-.25} max={+.25} step={0} value={.03815754722} onChange={prop.onChangeLat}></Slider>
                <Slider name={"lontitude"} min={-.5} max={+.5} step={0} value={.27923107222} onChange={prop.onChangeLon}></Slider>
                <Slider name={"direction"} min={-.5} max={+.5} step={0} value={0} onChange={prop.onChangeDir}></Slider>
                <label>Curvature</label>
                <Slider name={"kappa"} min={-1} max={+1} step={0} value={1} onChange={prop.onChangeKappa}></Slider>
                <label>Visibility</label>
                <Checkbox name={"Projections"} child={[{name: "Manifold", onChange: prop.onChangeVisMan, checked: true}, {name: "Projection", onChange: prop.onChangeVisPro, checked: true}]} onChange={prop.onChangeVis}></Checkbox>
            </form>
    );
};
export default AppInput;