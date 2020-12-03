import { useNavigation } from "@react-navigation/native";
import { Linking } from "expo";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import SubtleButton from "../components/Buttons/SubtleButton";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Member } from "../models/definitions";
import { setMemberData, setMemberToken } from "../redux/actions";
import { RootState } from "../redux/types";
import { LoginPageStyle } from "../styles";

const LoginPage = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const errorHandler = useErrorhandler();

    const loginMember = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);

    const [username, setMembername] = useState("");
    const [password, setpassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const login = () => {
        setIsLoading(true);
        apis.memberLogin(username, password)
            .then((res) => {
                dispatch(setMemberData(res.user));
                dispatch(setMemberToken(res.token));
                SecureStore.setItemAsync("token", res.token);
                SecureStore.setItemAsync("member_id", res.user.id);
                navigation.navigate("afterLogin");
            })
            .catch(errorHandler.handle)
            .finally(() => setIsLoading(false));
    };

    if (loginMember !== undefined) navigation.navigate("afterLogin");

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <ImageBackground source={require("../assets/bg.jpeg")} style={LoginPageStyle.outer}>
                    <View style={LoginPageStyle.overlay} />
                    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={LoginPageStyle.formOuter}>
                        <Image source={require("../assets/logo.png")} style={LoginPageStyle.logo} />
                        <View>
                            <Text style={LoginPageStyle.text}>手機號碼</Text>
                            <TextInput
                                placeholder="您註冊時輸入的手機號碼"
                                onChangeText={(v) => setMembername(v)}
                                style={LoginPageStyle.textInput}
                                keyboardType="phone-pad"
                            />

                            <Text style={LoginPageStyle.text}>會員密碼</Text>
                            <TextInput
                                placeholder="您註冊時輸入的密碼"
                                autoCompleteType="password"
                                secureTextEntry
                                onChangeText={(v) => setpassword(v)}
                                style={LoginPageStyle.textInput}
                            />

                            <PrimaryButton text="登入" onPress={login} disabled={isLoading} />
                            <SubtleButton
                                text="立即加入會員"
                                onPress={() => navigation.navigate("加入會員")}
                                disabled={isLoading}
                                style={{ marginTop: 16 }}
                            />
                            <SubtleButton
                                text="無法登入嗎？"
                                onPress={() => Linking.openURL("https://line.me/R/ti/p/%40332izodu")}
                                style={{ marginTop: 16 }}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginPage;
