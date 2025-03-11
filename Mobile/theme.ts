export type ThemeColors = {
    background: {
        screen: string;
        card: string;
        modal: string;
        screenHeader: string;
        timer: string;
        error: string;
        inputField: string;
        inputModalSearch: string;
        buttonPrimary: string;
        buttonSecondary: string;
        tabBar: string;
        navigation: string;
    }
    primary: string;
    text: {
        primary: string;
        secondary: string;
        muted: string;
        error: string;
        buttonPrimary: string;
        buttonSecondary: string;
        tabBar: string;
    };
    overlay: string;
    danger: string;
    border: {
        primary: string;
        strong: string;
        input: string;
    };
    warning: string;
    success: string;
    highlight: string;
    cardShadow: string;
    statusBar: string;
};

const colours: Record<"light" | "dark", ThemeColors> = {
    light: {
        background: {
            screen: '#F8F9FE',
            card: '#FFFFFF',
            modal: 'white',
            screenHeader: '#FFFFFF',
            timer: '#F85F6A',
            error: '#FDEDED',
            inputField: '#FFFFFF',
            inputModalSearch: '#F2F2F2',
            buttonPrimary: '#F85F6A',
            buttonSecondary: 'white',
            tabBar: 'white',
            navigation: "#EEEEEE"
        },
        cardShadow: '#000000',
        primary: '#F85F6A',
        text: {
            primary: '#333333',
            secondary: '#666666',
            error: '#FF0000',
            muted: '#AAAAAA',
            buttonPrimary: 'white',
            buttonSecondary: '#F85F6A',
            tabBar: 'gray',
        },
        overlay: 'rgba(0, 0, 0, 0.5)',
        danger: '#FF0000',
        border: {
            primary: '#DDDDDD',
            strong: '#AAAAAA',
            input: '#DDDDDD',
        },
        warning: '#FFD700',
        success: '#00FF00',
        highlight: '#D4D6DD',
        statusBar: 'black'
    },
    dark: {
        background: {
            screen: "#121212",
            card: "#2E2E2E",
            modal: "#1E1E1E",
            screenHeader: "#383838",
            timer: "#F85F6A",
            error: "#3B1F1F",
            inputField: '#FFFFFF',
            inputModalSearch: '#333333',
            buttonPrimary: '#F85F6A',
            buttonSecondary: 'white',
            tabBar: '#383838',
            navigation: '#111111'
        },
        cardShadow: '#000000',
        primary: "#F85F6A",
        text: {
            primary: "#EAEAEA",
            secondary: "#DDDDDD",
            error: "#FF0000",
            muted: "#999999",
            buttonPrimary: 'white',
            buttonSecondary: '#F85F6A',
            tabBar: '#EAEAEA',
        },
        overlay: "rgba(255, 255, 255, 0.3)",
        danger: "#FF4444",
        border: {
            primary: "#333333",
            strong: "#555555",
            input: "#444444",
        },
        warning: "#FFCC00",
        success: "#4CAF50",
        highlight: "#2A2D3A",
        statusBar: 'black'
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
