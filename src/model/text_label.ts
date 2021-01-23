/// <reference path="../core/utils.ts" />

declare interface Window { floorplanner: any }

module BP3D.Model {
  export class TextLabel {
    public textDimensions;

    constructor(private floorplan: Floorplan,
        public x: number, public y: number,
        public text: string, public background: string, public color: string,
        public id?: string) {
      var floorplanner = <BP3D.Floorplanner.Floorplanner>window.floorplanner;
      if (!floorplanner || floorplanner instanceof HTMLElement) { throw new Error('Text labels require `window.floorplanner` to be defined for `canvas` context'); }
      this.id = id || Core.Utils.guid();
      this.x = x;
      this.y = y;
      this.text = text;
      this.textDimensions = floorplanner.view.computeTextDimensions(this.text);
      this.background = background;
      this.color = color;
    }

    public getWidth(): number {

    }

    /** Moves corner relatively to new position.
     * @param dx The delta x.
     * @param dy The delta y.
     */
    public relativeMove(dx: number, dy: number) {
      this.move(this.x + dx, this.y + dy);
    }

    /** Moves corner to new position.
     * @param newX The new x position.
     * @param newY The new y position.
     */
    private move(newX: number, newY: number) {
      this.x = newX;
      this.y = newY;
    }
  }
}
