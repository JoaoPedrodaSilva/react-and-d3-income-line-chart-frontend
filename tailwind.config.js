/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        screens: {
            'xs': '400px'
        },
        fontFamily: {
            'concert': ['Concert One', 'cursive'],
            'poppins': ['Poppins', 'sans-serif'],
            'titillium': ['Titillium Web', 'sans-serif']
        }
    },
    plugins: [],
}
