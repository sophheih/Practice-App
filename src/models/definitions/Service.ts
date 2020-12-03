/* eslint-disable camelcase */
import { ObjectID } from "./ObjectID";

export interface Service {
    id: ObjectID;
    title: string;
    short_description: string;
    long_description: string;
    image_url: string[];
    duration: number;
    price: number;
    vip_per: number;
    nor_per: number;
    minus: number;
}

export function getServiceFormData(data: Service) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("short_description", data.short_description);
    formData.append("long_description", data.long_description);
    formData.append("duration", data.duration.toString());
    formData.append("price", data.price.toString());
    formData.append("nor_per", data.nor_per.toString());
    formData.append("vip_per", data.vip_per.toString());
    formData.append("minus", data.minus.toString());
    formData.append("image_url", data.image_url.toString());
    return formData;
}
