import React from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { useColourTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../theme";

interface ModalContainerProps {
    visible: boolean;
    header: React.ReactNode;
    content: React.ReactNode;
    onClose: () => void;
    buttons?: React.ReactElement[];    // List of buttons to display at bottom of modal
    verticalButtons?: boolean;      // If true, buttons are displayed vertically, if false, horizontally
    scrollable?: boolean;           // If true, uses ScrollView for content, if false, content controls its own scrolling (if any)
    fullWidthContent?: boolean;     // Applies if scrollable is true. If true, removes horizontal padding on scrollable content
    modals?: React.ReactNode;       // Any additional modals the modal needs to control
}

export default function ModalContainer({
    visible,
    header,
    content,
    onClose,
    buttons,
    verticalButtons = false,
    scrollable = true,
    fullWidthContent = false,
    modals,
}: ModalContainerProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <Modal visible={visible} transparent animationType="fade" >
            <TouchableWithoutFeedback onPress={onClose} >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={styles.overlay} >
                        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                            {/* Header */}
                            {header}

                            <View style={styles.content}>
                                {/* Conditional Scrolling */}
                                {scrollable ? (
                                    <ScrollView
                                        contentContainerStyle={[styles.contentContainer, fullWidthContent && styles.fullWidth]}
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={true}
                                    >
                                        {content}
                                    </ScrollView>
                                ) : (
                                    <>
                                        {content}
                                    </>
                                )}
                            </View>

                            {/* Buttons */}
                            {buttons && buttons?.length > 0 ? (
                                <View style={[styles.buttonRow, verticalButtons && styles.verticalButtons]}>
                                    {buttons?.map((button, index) => (
                                        React.cloneElement(button, { key: index })
                                    ))}
                                </View>
                            ) : null}

                            {/* Modals */}
                            {modals}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: colors.background.modal,
        paddingVertical: 20,
        width: "85%",
        borderRadius: 10,
        elevation: 5,
        maxHeight: "90%",
    },
    content: {
        flexShrink: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    fullWidth: {
        paddingHorizontal: 0,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingHorizontal: 20,
    },
    verticalButtons: {
        flexDirection: "column",
        gap: 10,
    }
})