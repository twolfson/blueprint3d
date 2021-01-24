/// <reference path="../../lib/jquery.d.ts" />
/// <reference path="../core/configuration.ts" />
/// <reference path="../model/floorplan.ts" />
/// <reference path="floorplanner_view.ts" />

module BP3D.Floorplanner {
  /** how much will we move a corner to make a wall axis aligned (cm) */
  const snapTolerance = 25;

  /**
   * The Floorplanner implements an interactive tool for creation of floorplans.
   */
  export class Floorplanner {

    /** */
    public mode = 0;

    /** */
    public activeWall = null;

    /** */
    public activeCorner = null;

    /** */
    public activeTextLabel = null;

    /** */
    public overlay = null;

    /** */
    // DEV: Contrasting to activeWall in that it persists focus
    //   and persists after overlay is gone (strange edge cases around `mouseleave`)
    public selectedWalls = null;

    /** */
    public originX = 0;

    /** */
    public originY = 0;

    /** drawing state */
    public targetX = 0;

    /** drawing state */
    public targetY = 0;

    /** drawing state */
    public lastNode = null;

    /** */
    private wallWidth: number;

    /** */
    private modeResetCallbacks = $.Callbacks();

    /** */
    private containerElement;

    /** */
    private canvasElement;

    /** */
    public view: FloorplannerView;

    /** */
    private mouseDown = false;

    /** */
    private mouseMoved = false;

    /** in ThreeJS coords */
    private mouseX = 0;

    /** in ThreeJS coords */
    private mouseY = 0;

    /** in ThreeJS coords */
    private rawMouseX = 0;

    /** in ThreeJS coords */
    private rawMouseY = 0;

    /** mouse position at last click */
    private lastX = 0;

    /** mouse position at last click */
    private lastY = 0;

    /** */
    private cmPerPixel: number;

    /** */
    private pixelsPerCm: number;

    /** */
    constructor(container: string, canvas: string, private floorplan: Model.Floorplan) {

      this.containerElement = $("#" + container);
      this.canvasElement = $("#" + canvas);

      this.view = new FloorplannerView(this.floorplan, this, canvas);

      this.cmPerPixel = Core.Configuration.data['cmPerPixel'];
      this.pixelsPerCm = Core.Configuration.data['pixelsPerCm'];

      this.wallWidth = 10.0 * this.pixelsPerCm;

      // Initialization:

      this.setMode(floorplannerModes.MOVE);

      var scope = this;

      this.canvasElement.mousedown(() => {
        scope.mousedown();
      });
      this.containerElement.mousemove((event) => {
        scope.mousemove(event);
      });
      this.containerElement.mouseup(() => {
        scope.mouseup();
      });
      this.containerElement.mouseleave(() => {
        scope.mouseleave();
      });

      $(document).keyup((e) => {
        if (e.keyCode == 27) {
          scope.escapeKey();
        }
      });

      floorplan.roomLoadedCallbacks.add(() => {
        scope.reset()
      });
    }

    /** */
    private escapeKey() {
      this.setMode(floorplannerModes.MOVE);
    }

    /** */
    private updateTarget() {
      if (this.mode == floorplannerModes.DRAW && this.lastNode) {
        if (Math.abs(this.mouseX - this.lastNode.x) < snapTolerance) {
          this.targetX = this.lastNode.x;
        } else {
          this.targetX = this.mouseX;
        }
        if (Math.abs(this.mouseY - this.lastNode.y) < snapTolerance) {
          this.targetY = this.lastNode.y;
        } else {
          this.targetY = this.mouseY;
        }
      } else {
        this.targetX = this.mouseX;
        this.targetY = this.mouseY;
      }

      this.view.draw();
    }

    /** */
    private mousedown() {
      this.mouseDown = true;
      this.mouseMoved = false;
      this.lastX = this.rawMouseX;
      this.lastY = this.rawMouseY;

      // delete
      if (this.mode == floorplannerModes.DELETE) {
        if (this.activeCorner) {
          this.activeCorner.removeAll();
        } else if (this.activeWall) {
          this.activeWall.remove();
        } else {
          this.setMode(floorplannerModes.MOVE);
        }
      }

      // DEV: Must come after `delete` check as that changes mode to MOVE
      // multiselect
      if (this.mode == floorplannerModes.MOVE) {
        // If we have a target
        if (this.activeCorner || this.activeWall) {
          // If the target isn't in our selection, then remove our selection
          if (this.selectedWalls && !this.selectedWalls.includes(this.activeWall)) {
            this.selectedWalls = null;
          }
        // Otherwise (no target), start a new overlay
        } else {
          this.overlay = {
            startX: this.mouseX,
            startY: this.mouseY,
            endX: this.mouseX,
            endY: this.mouseY,
          };
          this.selectedWalls = null;
        }
        this.view.draw();
      }
    }

    /** */
    private mousemove(event) {
      this.mouseMoved = true;

      // update mouse
      this.rawMouseX = event.clientX;
      this.rawMouseY = event.clientY;

      this.mouseX = (event.clientX - this.canvasElement.offset().left) * this.cmPerPixel + this.originX * this.cmPerPixel;
      this.mouseY = (event.clientY - this.canvasElement.offset().top) * this.cmPerPixel + this.originY * this.cmPerPixel;

      // update target (snapped position of actual mouse)
      if (this.mode == floorplannerModes.DRAW || (this.mode == floorplannerModes.MOVE && this.mouseDown)) {
        this.updateTarget();
      }

      // update object target
      if (this.mode != floorplannerModes.DRAW && !this.mouseDown) {
        // Determine what we're hovering
        var hoverCorner = this.floorplan.overlappedCorner(this.mouseX, this.mouseY);
        var hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);
        var hoverTextLabel = this.floorplan.overlappedTextLabel(this.mouseX, this.mouseY);
        var draw = false;

        // Update all our targets
        if (hoverCorner !== this.activeCorner) {
          this.activeCorner = hoverCorner;
          draw = true;
        }
        if (hoverWall !== this.activeWall) {
          this.activeWall = hoverWall;
          draw = true;
        }
        if (hoverTextLabel !== this.activeWall) {
          this.activeTextLabel = hoverTextLabel;
          draw = true;
        }

        // If there was a corner, ignore everything else
        if (this.activeCorner) {
          this.activeWall = null;
        // Otherwise, if there's a text label, ignore walls
        } else if (this.activeTextLabel) {
          this.activeWall = null;
        // Otherwise, if there's a wall, do nothing
        } else if (this.activeWall) {
        }

        // Perform our draw
        if (draw) {
          this.view.draw();
        }
      }

      // panning
      if (this.mouseDown && !this.activeCorner && !this.activeWall) {
        // Disabled for fixed viewports
        // this.originX += (this.lastX - this.rawMouseX);
        // this.originY += (this.lastY - this.rawMouseY);
        // this.lastX = this.rawMouseX;
        // this.lastY = this.rawMouseY;
        // this.view.draw();
      }

      // dragging
      if (this.mode == floorplannerModes.MOVE && this.mouseDown) {
        // If we have a selection, move that
        // DEV: Selection will become deselected on mouse down
        if (!this.overlay && this.selectedWalls) {
          var seenCorners = new Set();
          this.selectedWalls.forEach((wall) => {
            if (!seenCorners.has(wall.start)) {
              wall.start.relativeMove(
                (this.rawMouseX - this.lastX) * this.cmPerPixel,
                (this.rawMouseY - this.lastY) * this.cmPerPixel
              );
            }
            if (!seenCorners.has(wall.end)) {
              wall.end.relativeMove(
                (this.rawMouseX - this.lastX) * this.cmPerPixel,
                (this.rawMouseY - this.lastY) * this.cmPerPixel
              );
            }
            seenCorners.add(wall.start);
            seenCorners.add(wall.end);
          });
          this.lastX = this.rawMouseX;
          this.lastY = this.rawMouseY;
        // Otherwise, if we're targeting a corner, move it
        } else if (this.activeCorner) {
          this.activeCorner.move(this.mouseX, this.mouseY);
          this.activeCorner.snapToAxis(snapTolerance);
        // Otherwise, if our target is a wall
        } else if (this.activeWall) {
          this.activeWall.relativeMove(
            (this.rawMouseX - this.lastX) * this.cmPerPixel,
            (this.rawMouseY - this.lastY) * this.cmPerPixel
          );
          this.activeWall.snapToAxis(snapTolerance);
          this.lastX = this.rawMouseX;
          this.lastY = this.rawMouseY;
        // Otherwise (no target)
        } else {
          // Track our overlay positioning and selected walls
          this.overlay.endX = this.mouseX;
          this.overlay.endY = this.mouseY;
          this.selectedWalls = this.floorplan.containedWalls(
            this.overlay.startX, this.overlay.startY,
            this.overlay.endX, this.overlay.endY);
        }
        this.view.draw();
      }
    }

    /** */
    private mouseup() {
      this.mouseDown = false;

      // drawing
      if (this.mode == floorplannerModes.DRAW && !this.mouseMoved) {
        var corner = this.floorplan.newCorner(this.targetX, this.targetY);
        if (this.lastNode != null) {
          this.floorplan.newWall(this.lastNode, corner);
        }
        if (corner.mergeWithIntersected() && this.lastNode != null) {
          this.setMode(floorplannerModes.MOVE);
        }
        this.lastNode = corner;
      }

      // dragging
      if (this.mode == floorplannerModes.MOVE) {
        if (this.activeCorner) {
          this.activeCorner.mergeWithIntersected();
        } else if (this.activeWall) {
          this.activeWall.start.mergeWithIntersected();
          this.activeWall.end.mergeWithIntersected();
        } else if (this.overlay) {
          this.overlay = null;
          this.view.draw();
        } else if (this.selectedWalls) {
          this.selectedWalls.forEach((wall) => {
            wall.start.mergeWithIntersected();
            wall.end.mergeWithIntersected();
          });
        }
      }
    }

    /** */
    private mouseleave() {
      this.mouseDown = false;
      if (this.overlay) {
        this.overlay = null;
        this.selectedWalls = null;
      }
      //scope.setMode(scope.modes.MOVE);
      this.view.draw();
    }

    /** */
    private reset() {
      this.resizeView();
      this.setMode(floorplannerModes.MOVE);
      this.resetOrigin();
      this.view.draw();
    }

    /** */
    private resizeView() {
      this.view.handleWindowResize();
    }

    /** */
    private setMode(mode: number) {
      this.lastNode = null;
      this.selectedWalls = null;
      this.mode = mode;
      this.modeResetCallbacks.fire(mode);
      this.updateTarget();
    }

    /** Sets the origin so that floorplan is centered */
    private resetOrigin() {
      var centerX = this.canvasElement.innerWidth() / 2.0;
      var centerY = this.canvasElement.innerHeight() / 2.0;
      var centerFloorplan = this.floorplan.getCenter();
      this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
      this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
    }

    /** Convert from THREEjs coords to canvas coords. */
    public convertX(x: number): number {
      return (x - this.originX * this.cmPerPixel) * this.pixelsPerCm;
    }

    /** Convert from THREEjs coords to canvas coords. */
    public convertY(y: number): number {
      return (y - this.originY * this.cmPerPixel) * this.pixelsPerCm;
    }
  }
}
