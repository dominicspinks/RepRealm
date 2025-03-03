import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Keyboard } from "react-native";
import { isCategoryNameUnique, addCategory, updateCategory } from "../../services/categoriesService";
import { getColours } from "../../services/coloursService";
import { Category, Colour } from "../../db/schema";
import Button from "../buttons/Button";
import SelectColourModal from "./SelectColourModal";
import BackIcon from "../icons/BackIcon";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import ModalContainer from "./ModalContainer";
import React from "react";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";

interface SetCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    category?: Category | null;
}

export default function SetCategoryModal({ visible, onClose, category }: SetCategoryModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    const [name, setName] = useState(category?.name || "");
    const [colour, setColour] = useState(category?.colourId || null);
    const [colours, setColours] = useState<Colour[]>([]);
    const [isSelectColourVisible, setIsSelectColourVisible] = useState(false);

    // **Load colours when modal opens**
    useEffect(() => {
        async function fetchColours() {
            const result = await getColours();
            setColours(result);
            if (!colour && result.length > 0) {
                setColour(result[0].id);
            }
        }

        if (visible) fetchColours();
    }, [visible]);

    // Set category name
    useEffect(() => {
        setName(category?.name ?? "");
    }, [category]);

    // **Handle category saving**
    async function handleSave() {
        if (!name.trim()) {
            Alert.alert("Error", "Category name is required.");
            return;
        }

        const unique = await isCategoryNameUnique(name, category?.id);
        if (!unique) {
            Alert.alert("Error", "Category name must be unique.");
            return;
        }

        if (!colour) {
            Alert.alert("Error", "Please select a colour.");
            return;
        }

        if (category) {
            await updateCategory(category.id, name, colour);
        } else {
            await addCategory(name, colour);
        }

        onClose();
    }

    function handleClose() {
        setName(category?.name || "");
        onClose();
    }

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    leftElement={<BackIcon action={handleClose} />}
                    centreElement={<ModalHeaderTitle title={category ? "Edit Category" : "Add Category"} />}
                />
            }
            onClose={onClose}
            content={
                <>
                    <View style={styles.inputContainer}>
                        {/* Name Input */}
                        <TextInput
                            placeholder="Category name"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />

                        {/* Colour Selection */}
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                setIsSelectColourVisible(true)
                            }}
                            style={styles.colourButton}>
                            <View style={[styles.colourPreview, { backgroundColor: colours.find(c => c.id === colour)?.hex || "#000" }]} />
                        </TouchableOpacity>
                    </View>
                </>
            }
            buttons={[
                <Button variant="secondary" title="Cancel" onPress={handleClose} style={styles.button} />,
                <Button title="Save" onPress={handleSave} style={styles.button} />
            ]}
            modals={
                <>
                    <SelectColourModal
                        visible={isSelectColourVisible}
                        onClose={() => setIsSelectColourVisible(false)}
                        onSelectColour={setColour}
                        selectedColourId={colour}
                        colours={colours}
                    />
                </>
            }
        />
    );
}

// **Styles**
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
        marginBottom: 10,
        width: "100%",
    },
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginTop: 20,
        width: "80%",
    },
    colourButton: {
        marginTop: 20,
        alignSelf: "center",
    },
    colourPreview: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    button: {
        padding: 10,
        width: "48%",
    },
});
