import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../theme";

interface WorkoutCardProps {
    workout: {
        id: string;
        name: string;
        categories: { id: string; name: string; color: string }[];
        exercises: { id: string; name: string; categoryColor: string }[];
    };
    onEdit: () => void;
}

export default function WorkoutCard({ workout, onEdit }: WorkoutCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.card}>
            {/* Header */}
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
                <Text style={styles.title}>{workout.name}</Text>

                {/* Category Labels */}
                <View style={styles.categoryContainer}>
                    {workout.categories.map((category) => (
                        <View key={category.id} style={[styles.categoryLabel, { backgroundColor: category.color }]}>
                            <Text style={styles.categoryText}>{category.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Expand/Collapse Icon */}
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={theme.colors.text}
                />
            </TouchableOpacity>

            {/* Expanded View */}
            {expanded && (
                <View style={styles.expandedContainer}>
                    {workout.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.exerciseRow}>
                            <View style={[styles.categoryIndicator, { backgroundColor: exercise.categoryColor }]} />
                            <Text style={styles.exerciseText}>{exercise.name}</Text>
                        </View>
                    ))}

                    {/* Edit Button */}
                    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <MaterialIcons name="edit" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        maxWidth: "60%",
    },
    categoryLabel: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    categoryText: {
        color: "white",
        fontSize: 12,
    },
    expandedContainer: {
        marginTop: 10,
    },
    exerciseRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
    },
    categoryIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    exerciseText: {
        fontSize: 16,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 5,
        alignSelf: "flex-end",
        marginTop: 10,
    },
    editText: {
        color: "white",
        marginLeft: 5,
    },
});
