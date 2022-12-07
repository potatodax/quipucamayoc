import svgDonut from "bundle-text:../assets/donut.svg";

element.append(svgDonut);

enum QuipuFoundation {
  EndKnot = "ENDKNOT",
  PrimaryCord = "PRIMARYCORD",
  PendantCord = "PENDANTCORD",
  Grid = "GRID",
}

// used for digits in the ones place
enum QuipuLongKnot {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
}

// used for digits in the tens place and higher
enum QuipuOverhandKnot {
  One = 10,
  Two = 20,
  Three = 30,
  Four = 40,
  Five = 50,
  Six = 60,
  Seven = 70,
  Eight = 80,
  Nine = 90,
}

interface MarkInstance {
  x: number;
  y: number;
  // height: number;
  // width: number;
}

interface SceneGraph {
  mark: QuipuFoundation | QuipuLongKnot | QuipuOverhandKnot;
  markInstances: MarkInstance[];
  children: SceneGraph[];
}

const createPendantCords = (cordCount: number): MarkInstance[] => {
  // TODO verify this way of setting x coord works (like does the spacing work okay?)
  const cords = [...Array(cordCount).keys()].map((n) => ({
    x: n * 30,
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
      const x = numIdx * 30;
      // TODO determine better y-coord algorithm
      const y = 5 - digitsLen + digitIdx + 1;

      const knotInstance = { x: x, y: y };

      const knotID = y === 5 ? digit : digit * 10;

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

const sceneGraphFactory = (nums: number[]): SceneGraph => {
  const sceneGraph = {
    // TODO determine grid width programmatically
    mark: QuipuFoundation.Grid,
    markInstances: [{ x: 0, y: 0 }],
    children: [
      {
        // TODO determine primary cord width programmatically
        mark: QuipuFoundation.PrimaryCord,
        markInstances: [{ x: 0, y: 0 }],
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

const num_list = [0, 110, 20, 3, 12];
console.log(sceneGraphFactory(num_list));
