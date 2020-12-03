import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    Alert,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { ScrollView } from "react-native-gesture-handler";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Color } from "../styles/Color";
import isEmail from "../utils/isEmial";
import isPhoneNumber from "../utils/isPhoneNumber";

const genderOptions = [
    { label: "男性", value: "男" },
    { label: "女性", value: "女" },
    { label: "其他", value: "其他" },
];

const RegisterPage = () => {
    const navigation = useNavigation();
    const errorHandler = useErrorhandler();

    const [step, setStep] = useState(0);
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [gender, setGender] = useState("Man");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [realName, setRealName] = useState("");

    const [isLoading, setLoading] = useState(false);

    const goToStep2 = () => {
        if (!isPhoneNumber(phone)) {
            Alert.alert("請輸入正確的手機號碼");
            return;
        }

        if (password !== passwordCheck) {
            Alert.alert("您兩次輸入的密碼不同");
            return;
        }

        if (password.length < 8) {
            Alert.alert("密碼長度需要至少 8 碼");
            return;
        }

        setStep(1);
    };

    const register = () => {
        if (gender !== "男" && gender !== "女" && gender !== "其他") {
            Alert.alert("註冊失敗", "請選擇型別");
            return;
        }

        if (!isEmail(email)) {
            Alert.alert("請輸入正確的電子信箱");
            return;
        }

        setLoading(true);
        apis.memberRegister({ username: phone, password, gender, cellphone: phone, email, real_name: realName, birthday: new Date() })
            .then(() => {
                setLoading(false);
                Alert.alert("註冊成功", "請登入");
                navigation.navigate("登入");
            })
            .catch((err) => {
                setLoading(false);
                errorHandler.handle(err);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <ImageBackground source={require("../assets/bg.jpeg")} style={LoginPageStyle.outer}>
                    <View style={LoginPageStyle.overlay} />
                    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={LoginPageStyle.formOuter}>
                        <ScrollView style={{ paddingTop: 48 }}>
                            {step === 0 ? (
                                <>
                                    <Text style={LoginPageStyle.text}>本人手機號碼</Text>
                                    <TextInput
                                        textContentType="telephoneNumber"
                                        placeholder="請輸入您本人的手機號碼"
                                        onChangeText={(v) => setPhone(v)}
                                        value={phone}
                                        style={LoginPageStyle.textInput}
                                    />

                                    <Text style={LoginPageStyle.text}>會員密碼</Text>
                                    <TextInput
                                        textContentType="password"
                                        secureTextEntry
                                        onChangeText={(v) => setPassword(v)}
                                        value={password}
                                        style={LoginPageStyle.textInput}
                                    />

                                    <Text style={LoginPageStyle.text}>確認密碼</Text>
                                    <TextInput
                                        textContentType="password"
                                        secureTextEntry
                                        onChangeText={(v) => setPasswordCheck(v)}
                                        value={passwordCheck}
                                        style={LoginPageStyle.textInput}
                                    />

                                    <PrimaryButton onPress={goToStep2} text="下一步" />
                                </>
                            ) : (
                                <>
                                    <Text style={LoginPageStyle.text}>性別</Text>
                                    <Row style={{ height: 64, marginTop: 24 }}>
                                        {genderOptions.map((opt) => (
                                            <Col size={1} key={opt.value}>
                                                <TouchableOpacity onPress={() => setGender(opt.value)}>
                                                    <View
                                                        style={{
                                                            backgroundColor: opt.value === gender ? Color.primary : "white",
                                                            width: "80%",
                                                            padding: 18,
                                                            borderRadius: 12,
                                                        }}
                                                    >
                                                        <Text style={{ textAlign: "center" }}>{opt.label}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Text style={LoginPageStyle.text}>真實姓名</Text>
                                    <TextInput
                                        textContentType="name"
                                        secureTextEntry={false}
                                        keyboardType="default"
                                        onChangeText={(v) => setRealName(v)}
                                        value={realName}
                                        style={LoginPageStyle.textInput}
                                    />

                                    <Text style={LoginPageStyle.text}>電子信箱</Text>
                                    <TextInput
                                        textContentType="emailAddress"
                                        onChangeText={(v) => setEmail(v)}
                                        value={email}
                                        secureTextEntry={false}
                                        keyboardType="default"
                                        style={LoginPageStyle.textInput}
                                    />

                                    <PrimaryButton onPress={register} text="立即加入會員" disabled={isLoading} />

                                    <TouchableOpacity
                                        style={{ width: "100%", display: "flex", alignItems: "center", marginTop: 24 }}
                                        onPress={() => setStep(0)}
                                        disabled={isLoading}
                                    >
                                        <Text style={{ color: Color.light6, fontSize: 14 }}>上一步</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

const LoginPageStyle = StyleSheet.create({
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
        width: "80%",
        display: "flex",
        height: "100%",
        justifyContent: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.75)",
    },
});

export default RegisterPage;
