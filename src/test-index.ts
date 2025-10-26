const worker = new Worker(new URL("./test-worker.ts", import.meta.url), {
    type: "module",
});
console.log("Main running");
