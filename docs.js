requirejs.config({
    baseUrl: ".",
    paths: {
        "noneuclid": "lib/noneuclid",
        "p5": "https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5"
    }
});

requirejs(["app/main"]);