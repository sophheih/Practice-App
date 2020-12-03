import React from "react";
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from "react-native";
import RNModal from "react-native-modal";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

interface Props {
    enable: boolean;
    children: any;
    onClose: () => void;
    minHeight?: number;
    canSwipeClose?: boolean;
}

const Modal = (props: Props) => {
    return (
        <RNModal
            isVisible={props.enable}
            onBackdropPress={() => props.onClose()}
            deviceWidth={deviceWidth}
            style={{ justifyContent: "flex-end", margin: 0 }}
            deviceHeight={deviceHeight}
            swipeDirection={props.canSwipeClose === false ? undefined : "down"}
            onSwipeComplete={() => props.onClose()}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
                enabled
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                        style={{
                            backgroundColor: "rgb(40,40,40)",
                            padding: 36,
                            borderTopStartRadius: 24,
                            borderTopEndRadius: 24,
                            width: deviceWidth,
                        }}
                    >
                        {props.children}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </RNModal>
    );
};

export default Modal;
