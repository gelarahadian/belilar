import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        header: "48px",
        body: "16px",
        title: "24px",
        subtitle: "18px",
        secondaryText: "12px",
      },
      backgroundColor: {
        primary: "#FEFBF6",
        secondary: "#65B741",
        accent: "#FFD23F",
        lightGrey: "#F6F5F2",
        darkGrey: "#EEEEEE",
      },
      textColor: {
        primary: "#333",
        secondary: "#65B741",
        accent: "#FFD23F",
        lightGrey: "#F6F5F2",
      },
      borderColor: {
        primary: "#FEFBF6",
        secondary: "#65B741",
        accent: "#FFD23F",
        lightGrey: "#F6F5F2",
      },
      boxShadow: {
        form: "0 0 24px 0 rgba(0, 0, 0, 0.1)",
        sidebar: "2px 0 4px 0 rgba(0, 0, 0, 0.1)",
      },
      colors: {
        grey: "#9D9D9D",
      },
      fontWeight: {
        button: "bold",
      },
    },
  },
  plugins: [],
};
export default config;
