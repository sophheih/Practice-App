import { Address, Member, Service } from "../models/definitions";
import { rootReducer } from "./reducers";

export const SET_USER_DATA = "SET_USER_DATA";
export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const USER_LOGOUT = "USER_LOGOUT";

export const ADD_SERVICE = "ADD_SERVICE";
export const REMOVE_SERVICE = "REMOVE_SERVICE";
export const CLEAR_SHOPPING_CART = "CLEAR_SHOPPING_CART";

export const ADD_ADDRESS_TO_CACHE = "ADD_ADDRESS_TO_CACHE";
export const REMOVE_ADDRESS_FROM_CACHE = "REMOVE_ADDRESS_FROM_CACHE";

export const RECORD_CURRENT_SCREEN_NAME = "RECORD_CURRENT_SCREEN_NAME";
export const TOGGLE_CREATING_ADDRESS_MODAL = "TOGGLE_CREATING_ADDRESS_MODAL";
export const TOGGLE_CREATING_ORDER_MODAL = "TOGGLE_CREATING_ORDER_MODAL";

export type LoginMemberState = {
    user: Member | undefined;
    token: string | undefined;
};

export type ShoppingCartState = {
    items: Service[];
};

export type CacheDataState = {
    addresses: Address[]
}

export type UIState = {
    currentScreenName: string
    isCreatingAddress: boolean;
    isCreatingOrder: boolean;
}

export type RootState = ReturnType<typeof rootReducer>;
