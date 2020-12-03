/* eslint-disable camelcase */
import { ObjectID } from ".";

export interface Event {
    id: ObjectID;
    title: string;
    content: string;
    begin_date: Date;
    end_date: Date;
    image_url: string;
}

export function buildEvent(data: Event) {
    data.begin_date = new Date(+data.begin_date);
    data.end_date = new Date(+data.end_date);
    return data;
}

export function getEventFormData(data: Event) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("begin_date", data.begin_date.getTime().toString());
    formData.append("end_date", data.end_date.getTime().toString());
    formData.append("image_url", data.image_url);
    return formData;
}
