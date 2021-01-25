/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="floorplan.ts" />

module BP3D.Model {
  /** 
   * A Model connects a Floorplan and a Scene. 
   */
  export class Model {

    /** */
    public floorplan: Floorplan;

    /** */
    private roomLoadingCallbacks = $.Callbacks();

    /** */
    private roomLoadedCallbacks = $.Callbacks();

    /** name */
    private roomSavedCallbacks = $.Callbacks();

    /** success (bool), copy (bool) */
    private roomDeletedCallbacks = $.Callbacks();

    /** Constructs a new model.
     * @param textureDir The directory containing the textures.
     */
    constructor() {
      this.floorplan = new Floorplan();
    }

    // DEV: We could break out JSON.parse from this, but it would risk having state leaked elsewhere
    private loadSerialized(json: string) {
      // TODO: better documentation on serialization format.
      // TODO: a much better serialization format.
      this.roomLoadingCallbacks.fire();

      var data = JSON.parse(json)
      this.newRoom(data.floorplan);

      this.roomLoadedCallbacks.fire();
    }

    // DEV: We could break out JSON.stringify from this, but it would risk having state leaked elsewhere
    private exportSerialized(): string {
      var room = {
        floorplan: (this.floorplan.saveFloorplan()),
        items: []
      };

      return JSON.stringify(room);
    }

    private newRoom(floorplan: string) {
      this.floorplan.loadFloorplan(floorplan);
    }
  }
}
