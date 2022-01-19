({
    baseUrl: "lib",
    paths: {
        app: "../app",
        requireLib: "require",
        'p5': 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5'
    },
    name: "app",
    include: "requireLib",
    out: "app-built.js"
})