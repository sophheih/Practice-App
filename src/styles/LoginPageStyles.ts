import { StyleSheet } from "react-native";

export const LoginPageStyle = StyleSheet.create({
    outer: {
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    text: {
        marginTop: 16,
        color: "white",
        fontSize: 16,
    },
    logo: { width: 256, height: 256 },
    textInput: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 18,
        marginBottom: 16,
        marginHorizontal: 0,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    formOuter: {
        display: "flex",
        height: "100%",
        justifyContent: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.75)",
    },
});
