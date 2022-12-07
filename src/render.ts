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
import svgLongKnotOne from "bundle-text:../assets/long-knot-1.svg";
import svgLongKnotTwo from "bundle-text:../assets/long-knot-2.svg";
import svgLongKnotThree from "bundle-text:../assets/long-knot-3.svg";
import svgLongKnotFour from "bundle-text:../assets/long-knot-4.svg";
import svgLongKnotFive from "bundle-text:../assets/long-knot-5.svg";
import svgLongKnotSix from "bundle-text:../assets/long-knot-6.svg";
import svgLongKnotSeven from "bundle-text:../assets/long-knot-7.svg";
import svgLongKnotEight from "bundle-text:../assets/long-knot-8.svg";
import svgLongKnotNine from "bundle-text:../assets/long-knot-9.svg";
import svgOverhandKnotOne from "bundle-text:../assets/overhand-knot-1.svg";
import svgOverhandKnotTwo from "bundle-text:../assets/overhand-knot-2.svg";
import svgOverhandKnotThree from "bundle-text:../assets/overhand-knot-3.svg";
import svgOverhandKnotFour from "bundle-text:../assets/overhand-knot-4.svg";
import svgOverhandKnotFive from "bundle-text:../assets/overhand-knot-5.svg";
import svgOverhandKnotSix from "bundle-text:../assets/overhand-knot-6.svg";
import svgOverhandKnotSeven from "bundle-text:../assets/overhand-knot-7.svg";
import svgOverhandKnotEight from "bundle-text:../assets/overhand-knot-8.svg";
import svgOverhandKnotNine from "bundle-text:../assets/overhand-knot-9.svg";

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
    case QuipuLongKnot.One:
      return svgLongKnotOne;
    case QuipuLongKnot.Two:
      return svgLongKnotTwo;
    case QuipuLongKnot.Three:
      return svgLongKnotThree;
    case QuipuLongKnot.Four:
      return svgLongKnotFour;
    case QuipuLongKnot.Five:
      return svgLongKnotFive;
    case QuipuLongKnot.Six:
      return svgLongKnotSix;
    case QuipuLongKnot.Seven:
      return svgLongKnotSeven;
    case QuipuLongKnot.Eight:
      return svgLongKnotEight;
    case QuipuLongKnot.Nine:
      return svgLongKnotNine;
    case QuipuOverhandKnot.One:
      return svgOverhandKnotOne;
    case QuipuOverhandKnot.Two:
      return svgOverhandKnotTwo;
    case QuipuOverhandKnot.Three:
      return svgOverhandKnotThree;
    case QuipuOverhandKnot.Four:
      return svgOverhandKnotFour;
    case QuipuOverhandKnot.Five:
      return svgOverhandKnotFive;
    case QuipuOverhandKnot.Six:
      return svgOverhandKnotSix;
    case QuipuOverhandKnot.Seven:
      return svgOverhandKnotSeven;
    case QuipuOverhandKnot.Eight:
      return svgOverhandKnotEight;
    case QuipuOverhandKnot.Nine:
      return svgOverhandKnotNine;
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
    const widthBase = width + attributes.x;
    width = attributes.scaleX ? attributes.scaleX * widthBase : widthBase;
    height = height + attributes.y;

    const newViewBox = [minX, minY, width, height].join(" ");

    // newSVG assumes that:
    // only the primary cord and grid get scaleX attributes
    // and that the primary cord and grid are only made of <line > tags
    const newSVG = svgString
      .replace(/viewBox="([^"]+)"/, `viewBox="${newViewBox}"`)
      .replace(/width="([^"]+)"/, `width="${width}"`)
      .replace(/height="([^"]+)"/, `height="${height}"`)
      .replace(
        /<line /g,
        attributes.scaleX
          ? `<line transform="scale(${attributes.scaleX}, 1)"`
          : "<line "
      );

    return { newSVG, width, height };
  }
};

export const renderSceneGraph = (sceneGraph: SceneGraph): void => {
  let container: string[] = [];
  let maxMarkHeight = 0;
  let maxMarkWidth = 0;
  let maxLabelHeight = 0;

  const traverse = (sceneGraph: SceneGraph): void => {
    const mark = getSVG(sceneGraph["mark"]);

    if (mark) {
      sceneGraph["markInstances"].forEach((instance) => {
        const customMark = customizeSVG(mark, instance);

        if (customMark) {
          maxMarkWidth = Math.max(maxMarkWidth, customMark.width);
          maxMarkHeight = Math.max(maxMarkHeight, customMark.height);

          container.push(customMark.newSVG);

          if (
            sceneGraph["mark"] === QuipuFoundation.PendantCord &&
            instance.textLabel
          ) {
            const labelFontSize = 12;
            const labelX = instance.x;
            const labelY = instance.y;
            const labelYOffset = 475;
            const labelText = instance.textLabel;

            // labelWidthEstimate is adapted from
            // https://github.com/vega/vega/blob/825bfaba6ccfe3306183df22b8c955a07bb30714/packages/vega-scenegraph/src/util/text.js
            const labelWidthEstimate = Math.floor(
              labelText.length * labelFontSize * 0.8
            );
            const labelHeight = Math.cos(Math.PI / 4) * labelWidthEstimate;
            console.log(labelWidthEstimate, labelHeight);

            const pendantLabel = `<text x="${labelX}" y="${
              labelY + labelYOffset
            }" fill="#312B2B" transform="rotate(45, ${labelX}, ${
              labelY + labelYOffset
            })" style="font-size: ${labelFontSize}px; font-family: sans-serif">${labelText}</text>`;

            container.push(pendantLabel);

            maxLabelHeight = Math.max(maxLabelHeight, labelHeight);
          }
        }
      });
    }

    sceneGraph.children.forEach((child) => traverse(child));
  };

  traverse(sceneGraph);

  element.append(
    `<div style="min-width: max-content;"><svg width="${maxMarkWidth}" height="${
      maxMarkHeight + maxLabelHeight
    }" viewBox="0 0 ${maxMarkWidth} ${
      maxMarkHeight + maxLabelHeight
    }" >${container.join("")}</svg></div>`
  );
};
