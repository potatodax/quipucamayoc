export enum QuipuFoundation {
  EndKnot = "ENDKNOT",
  PrimaryCord = "PRIMARYCORD",
  PendantCord = "PENDANTCORD",
  Grid = "GRID",
}

// used for digits in the ones place
export enum QuipuLongKnot {
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
export enum QuipuOverhandKnot {
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

export interface PendantCord {
  cordLabel: string;
  cordValue: number;
}

export interface MarkInstance {
  x: number;
  y: number;
  scaleX?: number;
  textLabel?: string;
}

export interface SceneGraph {
  mark: QuipuFoundation | QuipuLongKnot | QuipuOverhandKnot;
  markInstances: MarkInstance[];
  children: SceneGraph[];
}
