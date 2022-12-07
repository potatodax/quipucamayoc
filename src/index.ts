// import svgDonut from "bundle-text:../assets/donut.svg";
import { renderSceneGraph } from "./render";
import { createSceneGraph } from "./sceneGraph";
import { PendantCord } from "./utils";

// element.append(svgDonut);

// data comes from self.data in quipucamayoc.py
const pendantCordsData: PendantCord[] = data.map((cord) => ({
  cordName: cord[x],
  cordValue: cord[y],
}));

const testQuipuSceneGraph = createSceneGraph(pendantCordsData);

renderSceneGraph(testQuipuSceneGraph);

console.log(x, y, data);
