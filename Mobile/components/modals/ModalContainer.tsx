import React from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";

interface ModalContainerProps {
    visible: boolean;
    header: React.ReactNode;
    content: React.ReactNode;
    button1?: React.ReactNode;
    button2?: React.ReactNode;
    scrollable?: boolean;           // If true, uses ScrollView for content, if false, content controls its own scrolling (if any)
    fullWidthContent?: boolean;     // Applies if scrollable is true. If true, removes horizontal padding on scrollable content
    modals?: React.ReactNode;
}

export default function ModalContainer({
    visible,
    header,
    content,
    button1,
    button2,
    scrollable = true,
    fullWidthContent = false,
    modals,
}: ModalContainerProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        {header}

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

                        {/* Buttons */}
                        {button1 || button2 ? (
                            <View style={styles.buttonRow}>
                                {button1}
                                {button2}
                            </View>
                        ) : null}

                        {/* Modals */}
                        {modals}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        paddingVertical: 20,
        width: "85%",
        borderRadius: 10,
        elevation: 5,
        maxHeight: "90%",
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
})