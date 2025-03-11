import { StyleSheet, View } from "react-native"
import { ThemeColors } from "../theme"
import CategoryBubble, { CategoryBubbleProps } from "./CategoryBubble"
import { useColourTheme } from "../contexts/ThemeContext";

interface CategoryBubbleListProps {
    categories: CategoryBubbleProps[]
}

export default function CategoryBubbleList({ categories }: CategoryBubbleListProps) {
    const { colors } = useColourTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.categoryContainer}>
            {categories.map((category) => (
                <CategoryBubble key={category.id} id={category.id} colour={category.colour} name={category.name} />
            ))}
        </View>
    )
}


const createStyles = (colors: ThemeColors) => StyleSheet.create({
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 10,
    },
})