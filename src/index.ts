import { renderSceneGraph } from "./render";
import { createSceneGraph } from "./sceneGraph";
import { PendantCord } from "./utils";

// data comes from self.data in quipucamayoc.py
const pendantCordsData: PendantCord[] = data.map((cord) => ({
  cordName: cord[x],
  cordValue: cord[y],
}));

const testQuipuSceneGraph = createSceneGraph(pendantCordsData);

renderSceneGraph(testQuipuSceneGraph);
