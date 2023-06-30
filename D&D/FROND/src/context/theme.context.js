// import React, { createContext, useContext, useState } from "react";
// import { ThemeProvider as StyledThemeProvider } from "styled-components";

// // Crea el contexto del tema
// export const ThemeContext = createContext();

// // Componente de proveedor de tema
// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState("light");

//   // Función para alternar el tema
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   // Objeto de tema actual
//   const themeObject = {
//     theme,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={themeObject}>
//       <StyledThemeProvider theme={{ mode: theme }}>
//         {children}
//       </StyledThemeProvider>
//     </ThemeContext.Provider>
//   );
// }

// // Hook personalizado para acceder al tema
// export function useTheme() {
//   return useContext(ThemeContext);
// }
