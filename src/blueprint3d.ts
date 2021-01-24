/// <reference path="model/model.ts" />
/// <reference path="floorplanner/floorplanner.ts" />

console.log('aaa');

import * as Model from "./model/model";

namespace BP3D {
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
    
    private model: Model.Model;

    private three: any; // Three.Main;

    private floorplanner: Floorplanner.Floorplanner;

    /** Creates an instance.
     * @param options The initialization options.
     */
    constructor(options: Options) {
      this.model = new Model.Model(options.textureDir);
      this.floorplanner = new Floorplanner.Floorplanner(options.containerElement, options.floorplannerElement, this.model.floorplan);
    }
  }
}

declare interface Window { BP3D: any }
window.BP3D = BP3D;