import svgDonut from "bundle-text:../assets/donut.svg";
import svgEndKnot from "bundle-text:../assets/end-knot.svg";
import svgPrimaryCord from "bundle-text:../assets/primary-cord.svg";
import svgPendantCord from "bundle-text:../assets/pendant-cord.svg";
import svgGrid from "bundle-text:../assets/grid.svg";
// import svgLongKnotOne from "bundle-text:../assets/ .svg"
// import svgLongKnotTwo from "bundle-text:../assets/ .svg"
// import svgLongKnotThree from "bundle-text:../assets/ .svg"
// import svgLongKnotFour from "bundle-text:../assets/ .svg"
// import svgLongKnotFive from "bundle-text:../assets/ .svg"
// import svgLongKnotSix from "bundle-text:../assets/ .svg"
// import svgLongKnotSeven from "bundle-text:../assets/ .svg"
// import svgLongKnotEight from "bundle-text:../assets/ .svg"
// import svgLongKnotNine from "bundle-text:../assets/ .svg"

// element.append(svgDonut);

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
    x: n * 30 + 40,
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
      const x = numIdx * 30 + 40;
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
    markInstances: [{ x: 0, y: 6 }],
    children: [
      {
        // TODO determine primary cord width programmatically
        mark: QuipuFoundation.PrimaryCord,
        markInstances: [{ x: 0, y: 6 }],
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

const getSVG = (
  mark: QuipuFoundation | QuipuLongKnot | QuipuOverhandKnot
): string | undefined => {
  switch (mark) {
    case QuipuFoundation.EndKnot:
      return svgEndKnot;
    case QuipuFoundation.PrimaryCord:
      return svgPrimaryCord;
    case QuipuFoundation.PendantCord:
      return svgPendantCord;
    case QuipuFoundation.Grid:
      return svgGrid;
    // case QuipuLongKnot.One:
    //   return svgLongKnotOne;
    // case QuipuLongKnot.Two:
    //   return svgLongKnotTwo;
    // case QuipuLongKnot.Three:
    //   return svgLongKnotThree;
    // case QuipuLongKnot.Four:
    //   return svgLongKnotFour;
    // case QuipuLongKnot.Five:
    //   return svgLongKnotFive;
    // case QuipuLongKnot.Six:
    //   return svgLongKnotSix;
    // case QuipuLongKnot.Seven:
    //   return svgLongKnotSeven;
    // case QuipuLongKnot.Eight:
    //   return svgLongKnotEight;
    // case QuipuLongKnot.Nine:
    //   return svgLongKnotNine;
    default:
      console.log("Could not find SVG for this mark");
      break;
  }
};

const getCustomSVG = (
  svgString: string,
  attributes: MarkInstance
): { newSVG: string; width: number; height: number } | undefined => {
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);

  if (viewBoxMatch) {
    let [minX, minY, width, height] = viewBoxMatch[1].split(" ").map(Number);
    minX = minX + attributes.x * -1;
    minY = minY + attributes.y * -1;
    width = width + attributes.x;
    height = height + attributes.y;

    const newViewBox = [minX, minY, width, height].join(" ");

    const newSVG = svgString
      .replace(/viewBox="([^"]+)"/, `viewBox="${newViewBox}"`)
      .replace(/width="([^"]+)"/, `width="${width}"`)
      .replace(/height="([^"]+)"/, `height="${height}"`);

    return { newSVG, width, height };
  }
};

const renderer = (sceneGraph: SceneGraph): void => {
  let container: string[] = [];
  let maxHeight = 0;
  let maxWidth = 0;

  const traverse = (sceneGraph: SceneGraph): void => {
    const mark = getSVG(sceneGraph["mark"]);

    if (mark) {
      sceneGraph["markInstances"].forEach((instance) => {
        const customMark = getCustomSVG(mark, instance);

        if (customMark) {
          maxWidth = Math.max(maxWidth, customMark.width);
          maxHeight = Math.max(maxHeight, customMark.height);

          container.push(customMark.newSVG);
        }
      });
    }

    sceneGraph.children.forEach((child) => traverse(child));
  };

  traverse(sceneGraph);

  element.append(
    `<svg width="${maxWidth}" height="${maxHeight}" viewBox="0 0 ${maxWidth} ${maxHeight}">${container.join(
      ""
    )}</svg>`
  );
};

const num_list = [0, 110, 20, 3, 12];

const testQuipuSceneGraph = sceneGraphFactory(num_list);

renderer(testQuipuSceneGraph);
