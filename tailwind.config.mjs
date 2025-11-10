import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "Poppins", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        vibrant: {
          pink: "#EC4899",
          purple: "#8B5CF6",
          blue: "#3B82F6",
          teal: "#14B8A6",
          orange: "#F97316",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        tilt: {
          "0%,100%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "50%": { transform: "rotateX(4deg) rotateY(4deg)" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(30px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        tilt: "tilt 6s ease-in-out infinite",
        gradientShift: "gradientShift 15s ease infinite",
        fadeUp: "fadeUp 0.6s ease forwards",
      },
      perspective: {
        800: "800px",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
    },
  },
  plugins: [typography, animate],
};

export default config;
