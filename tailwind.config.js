// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         raleway: ["Raleway", "sans-serif"], // Add Poppins as a custom font
//       },
//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"], // Add Poppins as a custom font
//       },
     
      

//     },
//   },
//   plugins: [
//     require('daisyui'),
//   ],
//   daisyui: {
//     themes: true, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
//     darkTheme: "cupcake", // name of one of the included themes for dark mode
//     base: true, // applies background color and foreground color for root element by default
//     styled: true, // include daisyUI colors and design decisions for all components
//     utils: true, // adds responsive and modifier utility classes
//     prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
//     logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
//     themeRoot: ":root", // The element that receives theme color CSS variables
//   },
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable 'class' strategy for dark mode
  theme: {
    extend: {
      colors: {
        primary: '#2962C4',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FFEB3B',
        info: '#2196F3',
        darkbg: '#121212',
        darksurface: '#1E1E1E',
        darktext: '#E0E0E0',
        darksuccess: '#388E3C',
        darkerror: '#D32F2F',
        darkwarning: '#FBC02D',
        darkinfo: '#1976D2'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
              fontFamily: {
                raleway: ["Raleway", "sans-serif"], // Add Poppins as a custom font
              },
              fontFamily: {
                poppins: ["Poppins", "sans-serif"], // Add Poppins as a custom font
              },

              animation: {
                "fade-in": "fadeIn 0.3s ease-in-out",
                "slide-in": "slideIn 0.3s ease-out",
                "fade-out": "fadeOut 0.3s ease-in-out",

              },
              keyframes: {
                fadeIn: {
                  "0%": { opacity: "0" },
                  "100%": { opacity: "1" },
                },   
                slideIn: {
                  "0%": { transform: "translateX(-10px)", opacity: "0" },
                  "100%": { transform: "translateX(0)", opacity: "1" },
                }, 
              },     
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#2962C4",
          "secondary": "#FF9800",
          "accent": "#9C27B0",
          "neutral": "#F5F5F5",
          "base-100": "#FFFFFF",
          "info": "#2196F3",
          "success": "#4CAF50",
          "warning": "#FFEB3B",
          "error": "#F44336"
        },
        dark: {
          "primary": "#1A237E",
          "secondary": "#FF9800",
          "accent": "#9C27B0",
          "neutral": "#1E1E1E",
          "base-100": "#121212",
          "info": "#1976D2",
          "success": "#388E3C",
          "warning": "#FBC02D",
          "error": "#D32F2F"
        },
      }
    ],
    darkTheme: "dark", // Set to the new dark theme
  },

}

