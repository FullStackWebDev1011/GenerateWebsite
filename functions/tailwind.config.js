module.exports = {
  mode: "jit",
  purge: [
    "./src/views/**/*.{eta,svg}",
  ],
  theme: {
    fontFamily: {
      "body": ["Lato", "sans-serif"],
      "serif": ["Playfair Display", "serif"],
    },
    extend: {
      colors: {
        green: {
          DEFAULT: "#7ED957",
          dark: "#54AB2E",
          darkest: "#346B1C",
        },
        gray: {
          light: "#F3F0EA",
          DEFAULT: "#66645E",
          dark: "#303031"
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
