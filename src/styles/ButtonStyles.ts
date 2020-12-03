import { StyleSheet } from "react-native";
import { Color } from ".";

export const ButtonStyles = StyleSheet.create({
    Base: { width: "100%", display: "flex", alignItems: "center" },
    PrimaryButton: {
        backgroundColor: Color.primary,
        fontSize: 18,
        marginTop: 24,
        padding: 16,
        width: "80%",
        textAlign: "center",
        borderRadius: 16,
        overflow: "hidden",
    },
    SubtleButton: { color: Color.light6, fontSize: 14 },
});
