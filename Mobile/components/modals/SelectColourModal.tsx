import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { theme, ThemeColors } from "../../theme";
import { Colour } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import ModalContainer from "./ModalContainer";
import React from "react";
import { useColourTheme } from "../../contexts/ThemeContext";

interface SelectColourModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectColour: (colourId: string) => void;
    selectedColourId: string | null;
    colours: Colour[];
}

export default function SelectColourModal({ visible, onClose, onSelectColour, selectedColourId, colours }: SelectColourModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={onClose} />}
                    centreElement={<ModalHeaderTitle title="Select Colour" />}
                />
            }
            onClose={onClose}
            scrollable={false}
            content={
                <>
                    <FlatList
                        data={colours}
                        keyExtractor={(item) => item.id}
                        numColumns={6}
                        contentContainerStyle={styles.gridContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSelectColour(item.id);
                                    onClose();
                                }}
                                style={[styles.colourButton, { backgroundColor: item.hex }]}
                            >
                                {item.id === selectedColourId && <View style={styles.selectedIndicator} />}
                            </TouchableOpacity>
                        )}
                    />
                </>
            }
        />
    );
}


// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    gridContainer: {
        alignItems: "center",
    },
    colourButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        margin: theme.spacing.small,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.background.card,
    },
});
