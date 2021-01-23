/// <reference path="../core/utils.ts" />

declare interface Window { floorplanner: any }

module BP3D.Model {
  export class TextLabel {
    public textDimensions;
    public padding = 4;
    public lineHeight = 19.2;

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
      // {width: 16.66, actualBoundingBoxLeft: 8.33, actualBoundingBoxRight: 8.66,
      //  actualBoundingBoxAscent: 5.69, actualBoundingBoxDescent: 3.30}
      this.textDimensions = floorplanner.view.computeTextDimensions(this.text);
      this.background = background;
      this.color = color;
    }

    public getWidth(): number {
      var info = this.textDimensions;
      return info.actualBoundingBoxLeft + info.actualBoundingBoxRight + this.padding*2;
    }
    public getHeight(): number {
      return this.lineHeight + this.padding*2;
    }
    public getCenterX(): number {
      return this.x + this.getWidth()/2;
    }
    public getCenterY(): number {
      return this.y + this.getHeight()/2;
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
