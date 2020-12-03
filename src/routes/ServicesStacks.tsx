import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ServiceDetail from "../pages/ServiceDetail";
import Services from "../pages/Services";

const Stack = createStackNavigator();

const ServicesStacks = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="服務列表" component={Services} />
            <Stack.Screen name="服務詳情" component={ServiceDetail} />
        </Stack.Navigator>
    );
};

export default ServicesStacks;
