import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ButtonStyles } from "../../styles/ButtonStyles";
import { Color } from "../../styles/Color";

interface Props {
    onPress: () => void;
    disabled?: boolean;
    text: string;
    style?: Object;
}

const PrimaryButton = (props: Props) => {
    return (
        <TouchableOpacity style={{ ...ButtonStyles.Base, ...props.style }} onPress={props.onPress} disabled={props.disabled}>
            <Text
                style={{
                    ...ButtonStyles.PrimaryButton,
                    backgroundColor: props.disabled ? Color.dark6 : Color.primary,
                    opacity: props.disabled ? 0.6 : 1,
                }}
            >
                {props.text}
            </Text>
        </TouchableOpacity>
    );
};

export default PrimaryButton;
