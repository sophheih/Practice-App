import { Address, Member, Service } from "../models/definitions";
import {
    ADD_ADDRESS_TO_CACHE,
    ADD_SERVICE,
    CLEAR_SHOPPING_CART,
    RECORD_CURRENT_SCREEN_NAME,
    REMOVE_ADDRESS_FROM_CACHE,
    REMOVE_SERVICE,
    SET_USER_DATA,
    SET_USER_TOKEN,
    TOGGLE_CREATING_ADDRESS_MODAL,
    TOGGLE_CREATING_ORDER_MODAL,
    USER_LOGOUT,
} from "./types";

interface SetMemberDataAction { type: typeof SET_USER_DATA; user: Member | undefined; }
export function setMemberData(user: Member | undefined): SetMemberDataAction {
    return { type: SET_USER_DATA, user };
}

interface SetMemberTokenAction {type: typeof SET_USER_TOKEN; token: string | undefined; }
export function setMemberToken(token: string | undefined): SetMemberTokenAction {
    return { type: SET_USER_TOKEN, token };
}

interface MemberLogoutAction {type: typeof USER_LOGOUT; }
export function userLogout(): MemberLogoutAction {
    return { type: USER_LOGOUT };
}

interface AddServiceAction { type: typeof ADD_SERVICE; service: Service; }
export function addService(service: Service): AddServiceAction {
    return { type: ADD_SERVICE, service };
}

interface RemoveServiceAction { type: typeof REMOVE_SERVICE; serviceID: string; }
export function removeService(serviceID: string): RemoveServiceAction {
    return { type: REMOVE_SERVICE, serviceID };
}

interface ClearShoppingCartAction { type: typeof CLEAR_SHOPPING_CART; }
export function clearShoppingCart(): ClearShoppingCartAction {
    return { type: CLEAR_SHOPPING_CART };
}

interface AddAddressToCacheAction { type: typeof ADD_ADDRESS_TO_CACHE; address: Address; }
export function addAddressToCache(address: Address) : AddAddressToCacheAction {
    return { type: ADD_ADDRESS_TO_CACHE, address };
}

interface RemoveAddressFromCacheAction { type: typeof REMOVE_ADDRESS_FROM_CACHE; addressID: string }
export function removeAddressFromCache(addressID: string): RemoveAddressFromCacheAction {
    return { type: REMOVE_ADDRESS_FROM_CACHE, addressID };
}

interface RecordCurrentScreenNameAction { type: typeof RECORD_CURRENT_SCREEN_NAME; currentScreenName: string}
export function recordCurrentScreenName(currentScreenName: string): RecordCurrentScreenNameAction {
    return { type: RECORD_CURRENT_SCREEN_NAME, currentScreenName };
}

interface ToggleCreatingAddressModalAction {type: typeof TOGGLE_CREATING_ADDRESS_MODAL, isCreating: boolean}
export function toggleCreatingAddressModal(isCreating: boolean) : ToggleCreatingAddressModalAction {
    return { type: TOGGLE_CREATING_ADDRESS_MODAL, isCreating };
}

interface ToggleCreatingOrderModalAction {type: typeof TOGGLE_CREATING_ORDER_MODAL, isCreating: boolean}
export function toggleCreatingOrderModal(isCreating: boolean) : ToggleCreatingOrderModalAction {
    return { type: TOGGLE_CREATING_ORDER_MODAL, isCreating };
}

export type LoginMemberAction = SetMemberDataAction | SetMemberTokenAction| MemberLogoutAction
export type ShoppingCartAction = AddServiceAction | RemoveServiceAction | ClearShoppingCartAction
export type CacheDataAction = AddAddressToCacheAction | RemoveAddressFromCacheAction
export type UIAction = RecordCurrentScreenNameAction | ToggleCreatingAddressModalAction | ToggleCreatingOrderModalAction;
