Changelog:

All `git tag` prefixed with `twolfson` for isolation

- twolfson-1.3.0 - Added interactive support for text labels (draggable + multiselect)
- twolfson-1.2.0 - Added static text labels
- twolfson-1.1.1 - Cleaned development workflow
    - Moved to `tsc` for watch support
    - Removed old/unused dependencies
- twolfson-1.1.0 - Added multiselect support for walls
    - *Note:* Done rather quickly/sloppily, can be built in a much more performant way, but we're exploring UX as current priority
    - Select middle of an edge
    - Select corner of an edge
    - Select multiple edges
    - Mouse leaving terminates overlay (as we can't guarnatee knowing mouse state on return)
    - Clicking on another edge deselects content
        - Hover preview
        - Actual movement
    - Clicking on a corner deselects content
        - Hover preview
        - Actual movement
    - Switching modes cancels multiselect
    - Clicking + dragging multiselect content
        - Moves relevant walls/corners
        - Merges relevant walls/corners
    - Bonus: Hovering a selected wall still grows bigger
- twolfson-1.0.0 - Customized repo to make it usable for our needs
    - Removed a lot of example UI
    - Disabled panning
    - Updated corners/walls to only merge on drag stop
    - Fixed corner removal behavior
    - Updated example page to demonstrate floating standalone


Development:

```bash
# Each in a separate tab
npm run develop
livereload example/
serve example/
```

Backlog:

- [ ] Fix double wall we create when collapsing into an "L" shape
  - Omitted for now as it's not a common case and non-breaking
- [ ] Fix draw click to count, even if there's a little drag
- [ ] Remove `items` and `scene` logic (no longer needed but lots of one-offs)
- [ ] Remove `jQuery` - Used for event listeners, `classList` manipulation, and offset handling
- [ ] Add `destroy` cleanup logic (e.g. unbinding DOM listeners, possibly emptying callbacks (might be unnecessary))
- [ ] Fix up quick yet inefficient decisions when adding multiselect (e.g. better iteration of multiple corners of walls, figuring out alternatives to selecting subsets (could use fixed length arrays as bitfields))
- [ ] Implement loading/serialization for text labels

---

## See it

This repository includes an example application built using blueprint3d:

### http://furnishup.github.io/blueprint3d/example/

## What is this?

This is a customizable application built on three.js that allows users to design an interior space such as a home or apartment. Below are screenshots from our Example App (link above). 

1) Create 2D floorplan:

![floorplan](https://s3.amazonaws.com/furnishup/floorplan.png)

2) Add items:

![add_items](https://s3.amazonaws.com/furnishup/add_items.png)

3) Design in 3D:

![3d_design](https://s3.amazonaws.com/furnishup/design.png)

## Developing and Running Locally

To get started, clone the repository and ensure you npm >= 3 and grunt installed, then run:

    npm install
    npm run build

The latter command generates `example/js/blueprint3d.js` from `src`.

The easiest way to run locally is to run a local server from the `example` directory. There are plenty of options. One uses Python's built in webserver:

    cd example

    # Python 2.x
    python -m SimpleHTTPServer

    # Python 3.x
    python -m http.server

Then, visit `http://localhost:8000` in your browser.

## Contribute!

This project requires a lot more work. In general, it was rushed through various prototype stages, and never refactored as much as it probably should be. We need your help!

Please contact us if you are interested in contributing.

### Todos

- More complete documentation (based on the TypeDoc comments)
- Test suite (e.g. jasmine)
- Make it easier to build a complete application using blueprint3d (cleaner API, more inclusive base, easier integration with a backend)
- Better serialization format for saving/loading "designs"
- Remove the dependency on jquery from the core source!
- Better use of npm conventions and packaging
- Various bug fixes
- refactor three/* - use of classes, lambdas
- update to current threejs
- introduce a more formal persistency format
- put all relevant settings into Core.Configuration to make them read-/writeable, User settings?
- complete type docs for all entities
- there're a few TODO_Ekki's left, kill them all

## Directory Structure

### `src/` Directory

The `src` directory contains the core of the project. Here is a description of the various sub-directories:

`core` - Basic utilities such as logging and generic functions

`floorplanner` - 2D view/controller for editing the floorplan

`items` - Various types of items that can go in rooms

`model` - Data model representing both the 2D floorplan and all of the items in it

`three` - 3D view/controller for viewing and modifying item placement


### `example/` Directory

The example directory contains an application built using the core blueprint3d javascript building blocks. It adds html, css, models, textures, and more javascript to tie everything together.

## License

This project is open-source! See LICENSE.txt for more information.
