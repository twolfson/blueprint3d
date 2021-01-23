module.exports = function (grunt) {

  require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

  var configuration = {
  };

  configuration.copy = {};
  configuration.copy['blueprint3d'] = {
    src: 'dist' + "/" + 'blueprint3d' + ".js",
    dest: 'example/js' + "/" + 'blueprint3d' + ".js"
  };

  configuration.copy.threejs = {
    src: "node_modules/three/three.min.js",
    dest: 'example/js' + "/three.min.js"
  }

  configuration.typescript = {
    options: {
      target: "es6",
      declaration: true,
      sourceMap: true,
      removeComments: false
    }
  };
  configuration.typescript['blueprint3d'] = {
    src: ["src/*.ts", "src/*/*.ts"],
    dest: 'dist' + "/" + 'blueprint3d' + ".js"
  };

  grunt.initConfig(configuration);

  grunt.registerTask("default", [
    "typescript:" + 'blueprint3d'
    "copy:threejs",
    "copy:" + 'blueprint3d'
  ]);
};
