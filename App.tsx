import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Provider, useDispatch } from "react-redux";
import LoginPage from "./src/pages/LoginPage";
import RegisterPage from "./src/pages/RegisterPage";
import { recordCurrentScreenName } from "./src/redux/actions";
import store from "./src/redux/store";
import AfterLogin from "./src/routes/AfterLogin";
import { Color } from "./src/styles";

const LoginStackNav = createStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <InsideStoreProvider />
        </Provider>
    );
}

const InsideStoreProvider = () => {
    const dispatch = useDispatch();

    const getActiveRouteName = (state: any) : any => {
        if (!state) return "error";
        const route = state.routes[state?.index || 0];
        if (!route) return "error";
        if (route.state) return getActiveRouteName(route.state);
        return route.name;
    };

    return <NavigationContainer theme={Theme} onStateChange={(state) => dispatch(recordCurrentScreenName(getActiveRouteName(state)))}>
        <LoginStackNav.Navigator
            mode="modal"
            screenOptions={(props) => ({
                headerShown: props.route.name === "加入會員",
                gestureEnabled: false,
            })}
            initialRouteName="afterLogin"
        >
            <LoginStackNav.Screen name="afterLogin" component={AfterLogin} />
            <LoginStackNav.Screen name="登入" component={LoginPage} />
            <LoginStackNav.Screen name="加入會員" component={RegisterPage} />
        </LoginStackNav.Navigator>
    </NavigationContainer>;
};

export const Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: Color.primary,
        background: "black",
        card: Color.dark1,
    },
};
