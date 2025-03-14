
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1eefac",
          foreground: "#1A1F2C",
          50: "#e6fef5",
          100: "#ccfced",
          200: "#99f9da",
          300: "#66f6c7",
          400: "#33f3b4",
          500: "#1eefac",
          600: "#0dbf89",
          700: "#0a8f67",
          800: "#076044",
          900: "#033022",
        },
        secondary: {
          DEFAULT: "#1A1F2C",
          foreground: "#ffffff",
          50: "#ecedf0",
          100: "#d9dae0",
          200: "#b3b6c1",
          300: "#8d91a3",
          400: "#666d84",
          500: "#404965",
          600: "#333a52",
          700: "#262b3e",
          800: "#1A1F2C",
          900: "#0d0f16",
        },
        accent: {
          DEFAULT: "#1EAEDB",
          foreground: "#ffffff",
          50: "#e9f7fd",
          100: "#d3effa",
          200: "#a7dff5",
          300: "#7bcff1",
          400: "#4fbfec",
          500: "#1EAEDB", // Original
          600: "#188baf",
          700: "#126883",
          800: "#0c4658",
          900: "#06232c",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#2A2F3C",
          foreground: "#D1D5DB",
        },
        card: {
          DEFAULT: "#1A1F2C",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 2s ease infinite",
      },
      boxShadow: {
        'glow': '0 0 15px 2px rgba(30, 239, 172, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ffffff',
            a: {
              color: '#1eefac',
              '&:hover': {
                color: '#0dbf89',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
