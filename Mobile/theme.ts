export type ThemeColors = {
    background: string;
    cardBackground: string;
    primary: string;
    text: string;
    inputBackground: string;
    inputBorder: string;
    inputBackgroundDark: string;
    mutedText: string;
    error: string;
    overlay: string;
    danger: string;
    border: string;
    borderStrong: string;
    errorBackground: string;
    warning: string;
    success: string;
    highlight: string;
    headerBackground: string;
};

const colours: Record<"light" | "dark", ThemeColors> = {
    light: {
        background: '#F8F9FE',
        cardBackground: '#FFFFFF',
        primary: '#F85F6A',
        text: '#333333',
        inputBackground: '#FFFFFF',
        inputBorder: '#DDDDDD',
        inputBackgroundDark: '#F2F2F2',
        mutedText: '#AAAAAA',
        error: '#FF0000',
        overlay: 'rgba(0, 0, 0, 0.5)',
        danger: '#FF0000',
        border: '#DDDDDD',
        borderStrong: '#AAAAAA',
        errorBackground: '#FDEDED',
        warning: '#FFD700',
        success: '#00FF00',
        highlight: '#D4D6DD',
        headerBackground: '#FFFFFF'
    },
    dark: {
        background: "#121212",
        cardBackground: "#1E1E1E",
        primary: "#F85F6A",
        text: "#EAEAEA",
        inputBackground: "#1E1E1E",
        inputBorder: "#444444",
        inputBackgroundDark: "#252525",
        mutedText: "#888888",
        error: "#FF6B6B",
        overlay: "rgba(0, 0, 0, 0.7)",
        danger: "#FF4444",
        border: "#333333",
        borderStrong: "#555555",
        errorBackground: "#3B1F1F",
        warning: "#FFCC00",
        success: "#4CAF50",
        highlight: "#2A2D3A",
        headerBackground: "#1E1E1E"
    }
}

export const theme = {
    colors: colours,
    fonts: {
        regular: 'System',
        bold: 'System',
    },
    spacing: {
        small: 8,
        medium: 16,
        large: 24,
    },
    cards: {
        borderRadius: 4,
    }
};
