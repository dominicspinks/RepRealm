import { View, Text, Modal } from "react-native";
import Button from "../buttons/Button";
import ModalContainer from "./ModalContainer";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { createWorkoutLog } from "../../services/workoutLogsService";
import React from "react";
import ModalHeader from "../headers/ModalHeader";
import ModalHeaderTitle from "../headers/ModalHeaderTitle";
import BackIcon from "../icons/BackIcon";

interface StartWorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    handleSelectSavedWorkout: () => void;
    handleStartNewWorkout: () => void;
}

export default function StartWorkoutModal({ visible, onClose, handleSelectSavedWorkout, handleStartNewWorkout }: StartWorkoutModalProps) {
    return (
        <ModalContainer
            visible={visible}
            header={<ModalHeader
                leftElement={<BackIcon action={onClose} />}
                centreElement={<ModalHeaderTitle title="Start a Workout" />}
            />}
            onClose={onClose}
            content={<></>}
            buttons={[
                <Button title="Saved Workouts" onPress={handleSelectSavedWorkout} />,
                <Button title="Start a New Workout" onPress={handleStartNewWorkout} />
            ]}
            verticalButtons
        />
    );
}
