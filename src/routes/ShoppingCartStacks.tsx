import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ShoppingCart from "../pages/ShoppingCart";

const Stack = createStackNavigator();

const ShoppingCartStacks = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="購物車" component={ShoppingCart} />
        </Stack.Navigator>
    );
};

export default ShoppingCartStacks;
