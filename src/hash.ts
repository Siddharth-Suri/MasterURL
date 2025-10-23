// This does compute hash however can also be used in precomputation at the start of the server which is also being used

export function computeHash() {
    const array = Array.from({ length: 10000 }, () => {
        const value = Math.random() * 1000000;
        const time = Date.now();
        const hasher = Bun.hash(value.toString(36), time);
        return hasher.toString(36);
    });
    return array;
}
