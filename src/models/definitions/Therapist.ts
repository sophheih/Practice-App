/* eslint-disable camelcase */
import { ObjectID } from "./ObjectID";

export interface Therapist {
    id: ObjectID;
    name: string;
    image_url: string;
    gender: "男" | "女" | "其他";
    description: string;
}
