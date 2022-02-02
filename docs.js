requirejs.config({
  baseUrl: ".",
  paths: {
    p5: "https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5",
    noneuclid: "lib/noneuclid",
  },
});

requirejs(["app/main"]);
