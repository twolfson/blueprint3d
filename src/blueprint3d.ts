import { Model } from "./model/model";
import { Floorplanner } from "./floorplanner/floorplanner";

/** Startup options. */
export interface Options {
  /** */
  widget?: boolean;

  /** */
  threeElement?: string;

  /** */
  threeCanvasElement? : string;

  /** */
  containerElement?: string;
  
  /** */
  floorplannerElement?: string;

  /** The texture directory. */
  textureDir?: string;
}

/** Blueprint3D core application. */
export class Blueprint3d {
  
  private model: Model;

  private three: any; // Three.Main;

  private floorplanner: Floorplanner;

  /** Creates an instance.
   * @param options The initialization options.
   */
  constructor(options: Options) {
    this.model = new Model(options.textureDir);
    this.floorplanner = new Floorplanner(options.containerElement, options.floorplannerElement, this.model.floorplan);
  }
}

declare interface Window { Blueprint3d: any }
window.Blueprint3d = Blueprint3d;