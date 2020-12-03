import { Service } from "../models/definitions";

export default function durationOfServices(services: Service[]) {
    let duration = 0;
    services.map((service) => {
        duration += service.duration;
    });
    return duration;
}
