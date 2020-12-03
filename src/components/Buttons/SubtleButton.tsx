import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ButtonStyles } from "../../styles/ButtonStyles";

interface Props {
    onPress: () => void;
    disabled?: boolean;
    text: string;
    style?: Object;
}

const SubtleButton = (props: Props) => {
    return (
        <TouchableOpacity style={{ ...ButtonStyles.Base, ...props.style }} onPress={props.onPress} disabled={props.disabled}>
            <Text style={{ ...ButtonStyles.SubtleButton, opacity: props.disabled ? 0.7 : 1 }}>{props.text}</Text>
        </TouchableOpacity>
    );
};

export default SubtleButton;
