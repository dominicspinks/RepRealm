import { StyleSheet, Text } from "react-native";
import { useColourTheme } from "../../contexts/ThemeContext";
import { theme, ThemeColors } from "../../theme";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import ModalContainer from "./ModalContainer";
import Button from "../buttons/Button";

interface ContinueAsGuestModalProps {
    visible: boolean,
    onClose: () => void;
    onContinue: () => void;
}

export default function ContinueAsGuestModal({ visible, onClose, onContinue }: ContinueAsGuestModalProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <ModalContainer
            visible={visible}
            header={
                <ModalHeader
                    centreElement={<ModalHeaderTitle title="Continue as Guest" />}
                />
            }
            onClose={onClose}
            content={
                <Text style={styles.message}>
                    Are you sure you want to continue as a guest? You won’t be able to sync workouts or access other users’ workouts.
                </Text>
            }
            buttons={[
                <Button variant="secondary" title="Login" onPress={onClose} style={styles.button} />,
                <Button title="Continue" onPress={onContinue} style={styles.button} />
            ]}

        />
    )
}


const createStyles = (colors: ThemeColors) => StyleSheet.create({
    message: {
        textAlign: 'center',
        marginBottom: theme.spacing.medium,
        color: colors.text.primary
    },
    button: {
        padding: 10,
        width: "48%",
    },
})