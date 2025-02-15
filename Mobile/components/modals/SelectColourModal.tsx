import { View, TouchableOpacity, Modal, StyleSheet, FlatList } from "react-native";
import { theme } from "../../theme";
import { Colour } from "../../db/schema";
import ModalHeader from "../headers/ModalHeader";
import BackIcon from "../icons/BackIcon";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";

interface SelectColourModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectColour: (colourId: string) => void;
    selectedColourId: string | null;
    colours: Colour[];
}

export default function SelectColourModal({ visible, onClose, onSelectColour, selectedColourId, colours }: SelectColourModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ModalHeader
                        leftElement={<BackIcon action={onClose} />}
                        centreElement={<ModalHeaderTitle title="Select Colour" />}
                    />

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
                </View>
            </View>
        </Modal>
    );
}


// **Styles**
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.medium,
        width: "80%",
        borderRadius: 10,
    },
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
        backgroundColor: theme.colors.cardBackground,
    },
});
