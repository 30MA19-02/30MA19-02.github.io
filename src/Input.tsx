import React from 'react';

import Slider from "./Slider";
import Checkbox from './Checkbox';

export default function DocsInput(){
    return (
            <form>
                <label>Segments</label>
                <Slider name={"height"} min={2} max={32} step={1} value={32}></Slider>
                <Slider name={"width"} min={3} max={24} step={1} value={24}></Slider>
                <label>Position</label>
                <Slider name={"latitude"} min={-.25} max={+.25} step={1e-18} value={.03815754722}></Slider>
                <Slider name={"lontitude"} min={-.5} max={+.5} step={1e-18} value={.27923107222}></Slider>
                <Slider name={"direction"} min={-.5} max={+.5} step={1e-18} value={0}></Slider>
                <label>Curvature</label>
                <Slider name={"kappa"} min={-1} max={+1} step={1e-18} value={1}></Slider>
                <label>Visibility</label>
                <Checkbox parent={"Projections"} child={["Manifold", "Projection"]}></Checkbox>
            </form>
    )
}