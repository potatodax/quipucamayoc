// import svgDonut from "bundle-text:../assets/donut.svg";
import { renderSceneGraph } from "./render";
import { createSceneGraph } from "./sceneGraph";

// element.append(svgDonut);

const num_list = [0, 110, 20, 3, 12, 99999];

const testQuipuSceneGraph = createSceneGraph(num_list);

renderSceneGraph(testQuipuSceneGraph);
