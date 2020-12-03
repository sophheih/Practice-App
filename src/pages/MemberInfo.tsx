import { FontAwesome5 } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { useDispatch, useSelector } from "react-redux";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Address, Member } from "../models/definitions";
import ParamList from "../models/routeParams";
import {
    addAddressToCache, removeAddressFromCache,
    setMemberData, toggleCreatingAddressModal, toggleCreatingOrderModal, userLogout,
} from "../redux/actions";
import { RootState } from "../redux/types";
import { Color } from "../styles/Color";
import dateToString from "../utils/dateToString";

const MemberInfo = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const errorHandler = useErrorhandler();
    const shouldRefresh = useRoute<RouteProp<ParamList, "會員資訊">>().params.shouldRefresh;

    const loginMember = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);

    const [isLoading, setIsLoading] = useState(false);
    const addresses = useSelector<RootState, Address[]>((state) => state.cacheData.addresses);

    const logout = () => {
        SecureStore.deleteItemAsync("token");
        dispatch(userLogout());
    };

    useEffect(() => {
        downloadData();
    }, []);

    useEffect(() => {
        if (shouldRefresh) {
            downloadData();
            navigation.navigate("會員資訊", { shouldRefresh: false });
        }
    }, [shouldRefresh]);

    const deleteAddress = (addressID: string) => {
        apis.deleteAddress(addressID)
            .then(() => dispatch(removeAddressFromCache(addressID)))
            .catch(errorHandler.handle);
    };

    const downloadData = () => {
        if (loginMember) {
            setIsLoading(true);
            apis.getMemberData(loginMember.id)
                .then((res) => {
                    dispatch(setMemberData(res));
                })
                .then(() => apis.getMemberAddresses(loginMember.id))
                .then((res) => {
                    res.map((addr) => dispatch(addAddressToCache(addr)));
                    setIsLoading(false);
                })
                .catch((err) => {
                    errorHandler.handle(err);
                    setIsLoading(false);
                });
        }
    };

    const user = loginMember;

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => downloadData()} tintColor={Color.dark6} />}
            >
                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.title}>{user?.real_name}</Text>
                        {user?.vip ? (
                            <Text style={styles.colored_subtle}>VIP 會員</Text>
                        ) : (
                            <Text style={styles.colored_subtle}>普通會員</Text>
                        )}
                    </View>
                    <View style={styles.listitem}>
                        <Text style={styles.subtle}>會員帳號</Text>
                        <Text style={styles.text}>{user?.username}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}>剩餘儲值金</Text>
                            <Text style={styles.text}>NT$ {user?.balance}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dispatch(toggleCreatingOrderModal(true))}>
                        <View style={styles.listitem}>
                            <Text style={styles.text}>會員加值</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.subtle}>電子郵件</Text>
                        <Text style={styles.text}>{user?.email}</Text>
                    </View>

                    <View style={styles.listitem}>
                        <Text style={styles.subtle}>生日</Text>
                        <Text style={styles.text}>{dateToString(user?.birthday)}</Text>
                    </View>

                    <View style={styles.listitem}>
                        <Text style={styles.subtle}>性別</Text>
                        <Text style={styles.text}>{user?.gender}</Text>
                    </View>

                    <View style={styles.listitem}>
                        <Text style={styles.subtle}>手機號碼</Text>
                        <Text style={styles.text}>{user?.cellphone}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.listitem}>
                        <Text style={styles.subtle}>已保存的住址</Text>
                    </View>
                    {addresses.map((addr) => (
                        <Row style={styles.listitem} key={addr.id}>
                            <Col size={11}>
                                <Text style={styles.subtle}>{addr.note}</Text>
                                <Text style={styles.text}>
                                    {addr.city} {addr.district} {addr.detail}
                                </Text>
                            </Col>
                            <TouchableOpacity onPress={() => deleteAddress(addr.id)}>
                                <Col size={1} style={{ marginRight: 16, marginVertical: 12 }}>
                                    <FontAwesome5 name="trash" size={16} color={Color.primary} />
                                </Col>
                            </TouchableOpacity>
                        </Row>
                    ))}

                    <TouchableOpacity onPress={() => dispatch(toggleCreatingAddressModal(true))}>
                        <View style={styles.listitem}>
                            <Text style={styles.subtle}> + 新增住址</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity onPress={() => logout()}>
                        <View style={styles.listitem}>
                            <Text style={styles.text}>登出</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    listitem: {
        borderColor: Color.dark2,
        borderWidth: 0.5,
        width: "100%",
        backgroundColor: Color.dark1,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    text: {
        lineHeight: 18,
        fontSize: 16,
        color: "white",
    },
    textInput: {
        lineHeight: 18,
        fontSize: 16,
        color: "white",
        marginTop: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(255,255,255,0.15)",
    },
    title: {
        lineHeight: 48,
        fontSize: 36,
        color: "white",
    },
    subtle: {
        opacity: 0.6,
        lineHeight: 18,
        fontSize: 14,
        color: "white",
    },
    colored_subtle: {
        opacity: 0.6,
        lineHeight: 18,
        fontSize: 14,
        fontWeight: "800",
        color: Color.primary,
    },
});

export default MemberInfo;
