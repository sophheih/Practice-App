/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CreateAddressModal from "../components/Modals/CreateAddressModal";
import NewOrderModal from "../components/Modals/NewOrderModal";
import useErrorhandler from "../hooks/useErrorHandler";
import apis from "../models/apis";
import { Member } from "../models/definitions";
import { setMemberData, setMemberToken } from "../redux/actions";
import { RootState } from "../redux/types";
import HistoriesStacks from "./HistoriesStacks";
import MemberInfoStacks from "./MemberInfoStacks";
import ServicesStacks from "./ServicesStacks";
import ShoppingCartStacks from "./ShoppingCartStacks";

const AppTabNav = createBottomTabNavigator();

const AfterLogin = () => {
    const navigation = useNavigation();
    const errorHandler = useErrorhandler();
    const dispatch = useDispatch();
    const loginMember = useSelector<RootState, Member | undefined>((state) => state.loginMember.user);

    useEffect(() => {
        if (loginMember === undefined) {
            SecureStore.getItemAsync("token").then((token) => {
                if (token === null) {
                    navigation.navigate("登入");
                    return;
                }
                SecureStore.getItemAsync("member_id").then((memberID) => {
                    if (memberID === null) {
                        navigation.navigate("登入");
                        return;
                    }
                    dispatch(setMemberToken(token));
                    apis.getMemberData(memberID)
                        .then((res) => dispatch(setMemberData(res)))
                        .catch(errorHandler.handle);
                });
            });
        }
    }, [loginMember]);

    return (
        <View style={{ flex: 1 }}>

            <NewOrderModal />
            <CreateAddressModal />

            <AppTabNav.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        let iconName = "";
                        if (route.name === "ServicesStacks") iconName = "calendar";
                        else if (route.name === "HistoriesStacks") iconName = "clipboard-list";
                        else if (route.name === "MemberInfoStacks") iconName = "user-alt";
                        else if (route.name === "ShoppingCartStacks") iconName = "shopping-cart";
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate(route.name)}>
                                <FontAwesome5 name={iconName} size={16} color={color} />
                            </TouchableOpacity>
                        );
                    },
                })}
            >
                <AppTabNav.Screen name="ServicesStacks" component={ServicesStacks} options={{ title: "預約" }} />
                <AppTabNav.Screen name="ShoppingCartStacks" component={ShoppingCartStacks} options={{ title: "購物車" }} />
                <AppTabNav.Screen name="HistoriesStacks" component={HistoriesStacks} options={{ title: "訂單" }} />
                <AppTabNav.Screen name="MemberInfoStacks" component={MemberInfoStacks} options={{ title: "會員" }} />
            </AppTabNav.Navigator>
        </View>
    );
};

export default AfterLogin;
