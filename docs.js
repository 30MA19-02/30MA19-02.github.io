requirejs.config({
    baseUrl: ".",
    paths: {
        "noneuclid": "../dist/noneuclid",
        "p5": "../node_modules/p5/lib/p5"
    }
});

requirejs(["app/main"]);