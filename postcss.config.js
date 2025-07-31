// postcss.config.js
export default {
    plugins: {
        '@tailwindcss/postcss': {},  // ← ここが新しいポイント！
        autoprefixer: {},
    },
}