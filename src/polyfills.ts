// Polyfills for APIs missing on older Safari (iOS < 15.4).
// Next.js 16 targets Safari 16.4+ and ships no polyfills, so anything
// below the browserslist floor in package.json must be patched here.

if (!Object.hasOwn) {
    Object.defineProperty(Object, "hasOwn", {
        value: (object: object, property: PropertyKey) =>
            Object.prototype.hasOwnProperty.call(object, property),
        configurable: true,
        writable: true,
    });
}

export {};
