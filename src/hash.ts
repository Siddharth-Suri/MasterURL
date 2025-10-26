// This does compute hash however can also be used in precomputation at the start of the server which is also being used
//  Adding a setInterval in a worker thread which allows auto fill up time to time
export function computeHash() {
    const set = new Set(
        Array.from({ length: 100000 }, () => {
            const value = Math.floor(Math.random() * 1e15);
            const time = Date.now();
            const hasher = Bun.hash(value.toString(36), time);
            return hasher.toString(36);
        })
    );
    return Array.from(set);
}
