({
    baseUrl: ".",
    paths: {
        requireLib: "../node_modules/requirejs/require",
        "noneuclid": "../dist/noneuclid",
        "p5": "../node_modules/p5/lib/p5"
    },
    name: "docs",
    include: "requireLib",
    out: "docs-built.js"
})