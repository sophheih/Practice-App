/* eslint-disable camelcase */
import { ObjectID } from "./ObjectID";

export interface Address {
    id: ObjectID;
    city: string;
    district: string;
    detail: string;
    member_id: ObjectID;
    note: string;
}

export const defaultAddress = {
    id: "",
    city: "新北市",
    district: "板橋區",
    detail: "某某路幾巷幾號",
    member_id: "",
    note: "家裡",
};
