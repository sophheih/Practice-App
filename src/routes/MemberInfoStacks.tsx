import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MemberInfo from "../pages/MemberInfo";
import OrderPayWebView from "../pages/OrderPayWebView";

const Stack = createStackNavigator();

const MemberInfoStacks = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="會員資訊" component={MemberInfo} initialParams={{ shouldRefresh: false }} />
            <Stack.Screen name="會員儲值" component={OrderPayWebView} />
        </Stack.Navigator>
    );
};

export default MemberInfoStacks;
