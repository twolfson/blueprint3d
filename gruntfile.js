module.exports = function (grunt) {

  require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

  var globalConfig = {
    moduleName: "blueprint3d",
    sources: ["src/*.ts", "src/*/*.ts"],
    outDir: "dist",
    docDir: "doc",
    exampleDir: "example/js/"
  };

  var configuration = {
  };

  configuration.copy = {};
  configuration.copy[globalConfig.moduleName] = {
    src: globalConfig.outDir + "/" + globalConfig.moduleName + ".js",
    dest: globalConfig.exampleDir + "/" + globalConfig.moduleName + ".js"
  };

  configuration.copy.threejs = {
    src: "node_modules/three/three.min.js",
    dest: globalConfig.exampleDir + "/three.min.js"
  }

  configuration.typescript = {
    options: {
      target: "es6",
      declaration: true,
      sourceMap: true,
      removeComments: false
    }
  };
  configuration.typescript[globalConfig.moduleName] = {
    src: globalConfig.sources,
    dest: globalConfig.outDir + "/" + globalConfig.moduleName + ".js"
  };

  grunt.initConfig(configuration);

  grunt.registerTask("default", [
    "typescript:" + globalConfig.moduleName
    "copy:threejs",
    "copy:" + globalConfig.moduleName
  ]);
};
