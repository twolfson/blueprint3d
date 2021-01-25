/*
 * Floorplanner controls
 */

var ViewerFloorplanner = function(blueprint3d) {

  var canvasWrapper = '#floorplanner';

  // buttons
  var move = '#move';
  var remove = '#delete';
  var draw = '#draw';

  var activeStlye = 'btn-primary disabled';

  this.floorplanner = blueprint3d.floorplanner;

  var scope = this;

  function init() {

    $( window ).resize( scope.handleWindowResize );
    scope.handleWindowResize();

    // mode buttons
    scope.floorplanner.modeResetCallbacks.add(function(mode) {
      $(draw).removeClass(activeStlye);
      $(remove).removeClass(activeStlye);
      $(move).removeClass(activeStlye);
      if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
          $(move).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
          $(draw).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
          $(remove).addClass(activeStlye);
      }

      if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
        $("#draw-walls-hint").show();
        scope.handleWindowResize();
      } else {
        $("#draw-walls-hint").hide();
      }
    });

    $(move).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
    });

    $(draw).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
    });

    $(remove).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
    });
  }

  this.updateFloorplanView = function() {
    scope.floorplanner.reset();
  }

  this.handleWindowResize = function() {
    // Disabled: Resizing to full window height
    // $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
    scope.floorplanner.resizeView();
  };

  init();
}; 

// DEV: Robust file-based version can be found in https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/example/js/example.js#L468-L503
window.loadDesign = function (data) {
  blueprint3d.model.loadSerialized(data);
};
window.exportDesign = function () {
  return blueprint3d.model.exportSerialized();
}

/*
 * Initialize!
 */

$(document).ready(function() {

  // main setup
  var opts = {
    containerElement: 'floorplanner',
    floorplannerElement: 'floorplanner-canvas',
    threeElement: '#viewer',
    threeCanvasElement: 'three-canvas',
    textureDir: "models/textures/",
    widget: false
  }
  var blueprint3d = new BP3D.Blueprint3d(opts);
  window.blueprint3d = blueprint3d;

  var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
  viewerFloorplanner.updateFloorplanView();
  viewerFloorplanner.handleWindowResize();
  blueprint3d.model.floorplan.update();

  // This serialization format needs work
  // Load a simple rectangle room
  // blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  // Another model option: https://github.com/furnishup/blueprint3d/blob/cac8b62c1a3839e929334bdc125bf8a74866be9e/example/js/example.js#L472

  // Custom default floorplan
  // console.log(blueprint3d.model.exportSerialized())
  blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":818.5150000000003,"y":388.6200000000001},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":1021.7150000000008,"y":388.6200000000001},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":1021.7150000000008,"y":184.20078759765622},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":818.5150000000003,"y":184.20078759765622}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  window.floorplanner = blueprint3d.floorplanner; // Exposed for `TextLabel` requirement
  var labels = [
    {text: 'Room 1', background: '#0084ce', color: 'white'}, // Blue
    {text: 'Room 2', background: '#00b7f0', color: 'white'}, // Light blue
    {text: 'Room 3', background: '#95c2cc', color: 'white'}, // Dark green/blue
    {text: 'Room 4', background: '#f5ad03', color: 'white'}, // Orange
    {text: 'Room 5', background: '#e7222c', color: 'white'}, // Red
    {text: 'Room 6', background: '#35d0ac', color: 'white'}, // Light green
    {text: 'Room 7', background: '#07bb12', color: 'white'}, // Dark green
    {text: 'Room 8', background: '#fdf73f', color: 'black'}, // Yellow
    {text: 'Room 9', background: '#701d85', color: 'white'}, // Purple
    {text: 'Building Hallway' /* Long name test */, background: '#fd5fda', color: 'white'}, // Pink
  ];
  labels.forEach((labelData, i) => {
    var x, y;
    if (i === 0) {
      // console.log(blueprint3d.model.floorplan.textLabels[0])
      x = 867; // cm
      y = 264; // cm
    } else {
      // console.log(blueprint3d.model.floorplan.textLabels[1])
      x = 1692; // cm
      y = (i-1) * 64 + 16; // cm
    }
    blueprint3d.model.floorplan.newTextLabel(
      x,
      y,
      labelData.text,
      labelData.background,
      labelData.color);
  });
  blueprint3d.model.floorplan.update();
  blueprint3d.model.floorplan.roomLoadedCallbacks.fire();
});
