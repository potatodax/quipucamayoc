import { MarkInstance, QuipuFoundation, SceneGraph } from "./utils";

const createPendantCords = (cordCount: number): MarkInstance[] => {
  const cords = [...Array(cordCount).keys()].map((idx) => ({
    x: idx * 30 + 40,
    y: 0,
  }));

  return cords;
};

const createKnots = (nums: number[]): SceneGraph[] => {
  let knotsDictionary: Record<number, MarkInstance[]> = {};

  nums.forEach((num, numIdx) => {
    const digitsArray = num.toString().split("").map(Number);
    const digitsLen = digitsArray.length;

    digitsArray.forEach((digit, digitIdx) => {
      if (!digit) {
        return;
      }
      const yBase = 5 - digitsLen + digitIdx + 1;
      const y = yBase * 90 - 60;
      const knotID = yBase === 5 ? digit : digit * 10;
      const x = numIdx * 30 + (knotID === 1 ? 32 : knotID < 10 ? 29 : 35);
      const knotInstance = { x: x, y: y };

      if (knotsDictionary[knotID]) {
        knotsDictionary[knotID] = [...knotsDictionary[knotID], knotInstance];
      } else {
        knotsDictionary[knotID] = [knotInstance];
      }
    });
  });

  let sceneGraph: SceneGraph[] = [];

  for (let knotID in knotsDictionary) {
    const knotSceneGraph: SceneGraph = {
      mark: Number(knotID),
      markInstances: knotsDictionary[knotID],
      children: [],
    };

    sceneGraph.push(knotSceneGraph);
  }

  return sceneGraph;
};

const getBackgroundScaleXFactor = (
  cordCount: number,
  svgWidth: number
): number => {
  return ((cordCount - 1) * 30) / svgWidth + 1;
};

export const createSceneGraph = (nums: number[]): SceneGraph => {
  const sceneGraph = {
    // TODO determine grid width programmatically
    mark: QuipuFoundation.Grid,
    markInstances: [
      { x: 16, y: 20, scaleX: getBackgroundScaleXFactor(nums.length, 43) },
    ],
    children: [
      {
        mark: QuipuFoundation.PrimaryCord,
        markInstances: [
          { x: 16, y: 6, scaleX: getBackgroundScaleXFactor(nums.length, 45) },
        ],
        children: [
          {
            mark: QuipuFoundation.EndKnot,
            markInstances: [{ x: 0, y: 0 }],
            children: [],
          },
          {
            mark: QuipuFoundation.PendantCord,
            markInstances: [...createPendantCords(nums.length)],
            children: [...createKnots(nums)],
          },
        ],
      },
    ],
  };

  return sceneGraph;
};
