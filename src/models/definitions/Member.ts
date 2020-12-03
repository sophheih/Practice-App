/* eslint-disable camelcase */
import { ObjectID } from "./ObjectID";

export interface Member {
    id: ObjectID;
    username: string;
    real_name: string;
    balance: number;
    gender: "男" | "女" | "其他";
    cellphone: string;
    email: string;
    vip: boolean;
    birthday: Date;
}

export function buildMember(data: Member) {
    data.birthday = new Date(+data.birthday.toString());
    return data;
}
