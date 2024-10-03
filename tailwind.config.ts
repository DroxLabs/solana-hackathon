import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "max(3.5%, 16px)",
    },

    screens: {
      sm: "576px",
      md: "768px",
      lg: "1000px",
      xl: "1300px",
      xxl: "1460px",
      xxxl: "1980px",
    },

    fontFamily: {
      primary: "Oxanium Regular, sans-serif",
      secondary: "Play Regular, sans-serif",
    },
    extend: {
      // backgroundImage: {
      // "blue-to-lightblue":
      //   "linear-gradient(90deg, #0D5067 0%, #50A2BF 18.4%, #167C9F 39.4%, #33A7D0 56.9%, #58BFE3 74.4%, #9BE5FF 86.4%, #D8F3FD 96.9%)",
      // },

      fontSize: {
        12: "12px",
        14: "14px",
        16: "16px",
        18: "18px",
        20: "20px",
        22: "22px",
        24: "24px",
        26: "26px",
        28: "28px",
        30: "30px",
        32: "32px",
        34: "34px",
        36: "36px",
        38: "38px",
        40: "40px",
        42: "42px",
        44: "44px",
        46: "46px",
        48: "48px",
        50: "50px",
        52: "52px",
        54: "54px",
        56: "56px",
        58: "58px",
        60: "60px",
        64: "64px",
        66: "66px",
        68: "68px",
        70: "70px",
        72: "72px",
        74: "74px",
        76: "76px",
        78: "78px",
        80: "80px",
        82: "82px",
        84: "84px",
        86: "86px",
        88: "88px",
        90: "90px",
      },

      lineHeight: {
        100: "100%",
        110: "110%",
        120: "120%",
        125: "125%",
        130: "130%",
        135: "135%",
        140: "140%",
        145: "145%",
        150: "150%",
        155: "155%",
        160: "160%",
      },

      letterSpacing: {
        tight: "-0.01em",
        tighter: "-0.02em",
        tightest: "-0.03em",
      },

      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "40px",
        xxl: "48px",

        "56px": "56px",
        "64px": "64px",
        "72px": "72px",
        "80px": "80px",
        "88px": "88px",
        "96px": "96px",
        "100px": "100px",
        "120px": "120px",
        "140px": "140px",
        "150px": "150px",
        "160px": "160px",
        "200px": "200px",
      },
      backgroundImage: {
        "nav-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
        "blue-to-lightblue":
          "linear-gradient(90deg, #0D5067 0%, #50A2BF 18.4%, #167C9F 39.4%, #33A7D0 56.9%, #58BFE3 74.4%, #9BE5FF 86.4%, #D8F3FD 96.9%)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          network: "rgba(10, 43, 65, 0.5)",
          wallet: "rgba(15, 92, 119, 1)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
