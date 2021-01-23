/// <reference path="../core/utils.ts" />

module BP3D.Model {
  export class TextLabel {
    constructor(private floorplan: Floorplan,
        public x: number, public y: number,
        public text: string,
        public background: string,
        public color: string,
        public id?: string) {
      this.id = id || Core.Utils.guid();
      this.x = x;
      this.y = y;
      this.text = text;
      this.background = background;
      this.color = color;
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
