import {
  MarkInstance,
  QuipuFoundation,
  QuipuLongKnot,
  QuipuOverhandKnot,
  SceneGraph,
} from "./utils";
import svgEndKnot from "bundle-text:../assets/end-knot.svg";
import svgPrimaryCord from "bundle-text:../assets/primary-cord.svg";
import svgPendantCord from "bundle-text:../assets/pendant-cord.svg";
import svgGrid from "bundle-text:../assets/grid.svg";
// import svgLongKnotOne from "bundle-text:../assets/long-knot-1.svg";
// import svgLongKnotTwo from "bundle-text:../assets/long-knot-2.svg";
// import svgLongKnotThree from "bundle-text:../assets/long-knot-3.svg";
// import svgLongKnotFour from "bundle-text:../assets/long-knot-4.svg";
// import svgLongKnotFive from "bundle-text:../assets/long-knot-5.svg";
// import svgLongKnotSix from "bundle-text:../assets/long-knot-6.svg";
// import svgLongKnotSeven from "bundle-text:../assets/long-knot-7.svg";
// import svgLongKnotEight from "bundle-text:../assets/long-knot-8.svg";
// import svgLongKnotNine from "bundle-text:../assets/long-knot-9.svg";

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

const customizeSVG = (
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

export const renderSceneGraph = (sceneGraph: SceneGraph): void => {
  let container: string[] = [];
  let maxHeight = 0;
  let maxWidth = 0;

  const traverse = (sceneGraph: SceneGraph): void => {
    const mark = getSVG(sceneGraph["mark"]);

    if (mark) {
      sceneGraph["markInstances"].forEach((instance) => {
        const customMark = customizeSVG(mark, instance);

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
