import { Order } from "../models/definitions";

export function getOrderStatusString(order: Order) {
    switch (order.status) {
    case "SUCCESS":
        return "付款成功";
    case "INVALID":
        return "已失效";
    case "UNPAID":
        return "尚未付款";
    }
}
