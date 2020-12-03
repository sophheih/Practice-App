import { Service } from "../models/definitions";

const calculatePrice = (data: Service | Service[], vip: boolean) => {
    if (data instanceof Array) {
        let total = 0;
        data.map((s) => (total += s.price * (vip ? s.vip_per : s.nor_per)));
        return total;
    } else {
        return data.price * (vip ? data.vip_per : data.nor_per);
    }
};

export default calculatePrice;
