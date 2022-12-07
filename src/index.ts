import { renderSceneGraph } from "./render";
import { createSceneGraph } from "./sceneGraph";
import { PendantCord } from "./utils";

// data comes from self.data in quipucamayoc.py
const pendantCordsData: PendantCord[] = data.map((cord) => ({
  cordLabel: cord[label],
  cordValue: cord[value],
}));

const testQuipuSceneGraph = createSceneGraph(pendantCordsData);

renderSceneGraph(testQuipuSceneGraph);
