import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { theme, ThemeColors } from "../theme";

// Define the shape of the context
interface ThemeContextType {
    colors: ThemeColors;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
    colors: theme.colors.light,
});

// **Theme Provider Component**
export const ColourThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme() || "light";
    const colors = theme.colors[colorScheme as "light" | "dark"];

    return (
        <ThemeContext.Provider value={{ colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

// **Custom hook to access theme**
export const useColourTheme = () => useContext(ThemeContext);
