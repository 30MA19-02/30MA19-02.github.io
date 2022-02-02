var requirejs = require("requirejs");

var config = {
  baseUrl: __dirname,
  paths: {
    requireLib: "../node_modules/requirejs/require",
    p5: "../node_modules/p5/lib/p5",
    noneuclid: "lib/noneuclid",
  },
  name: "docs",
  include: "requireLib",
  out: __dirname+"/docs-built.js",
};

requirejs.optimize(
  config,
  function (buildResponse) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    var contents = fs.readFileSync(config.out, "utf8");
  },
  function (err) {
    //optimization err callback
    console.log(err);
  }
);
