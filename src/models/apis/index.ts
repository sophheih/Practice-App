import { API_URL } from "../../config";
import store from "../../redux/store";
import {
    Address,
    buildEvent,
    buildMember,
    buildOrder,
    Event,
    Member,
    ObjectID,
    Order,
    Reservation,
    Service,
    Therapist,
} from "../definitions";
import { buildReservation } from "../definitions/Reservation";
interface ErrorResponse {
    message: string;
}

const authedFetch = (url: string, method: "GET" | "POST" | "DELETE", body?: string | FormData) => {
    const token = store.getState().loginMember.token;
    console.info("[Request] Sending " + method + " request to " + url);
    return fetch(API_URL + url, {
        method: method,
        headers: new Headers({ Authorization: "Token " + token }),
        body: body,
    }).finally(() => console.info("[Request] " + method + " request to " + url + " ended."));
};

export default class apis {
    static getAllService = () => {
        return new Promise<Service[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/service/", "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Service[];
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getMemberData = (id: string) => {
        return new Promise<Member>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/member/" + id, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resdata = res as Member;
                        resolve(buildMember(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getTherapistData = (therapistID: string) => {
        return new Promise<Therapist>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/therapist/" + therapistID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Therapist;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    static getMemberAddress = (addressID: string) => {
        return new Promise<Address>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/member/address/" + addressID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Address;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                });
        });
    };

    static getServiceData = (id: string) => {
        return new Promise<Service>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/service/" + id, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Service;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getMemberAddresses = (memberID: string) => {
        return new Promise<Address[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/member/address/?memberid=" + memberID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Address[];
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getOrders = (memberID: string) => {
        return new Promise<Order[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/order/?member_id=" + memberID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Order[];
                        resolve(resdata.map((order) => buildOrder(order)));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getReservations = (memberID: string) => {
        return new Promise<Reservation[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/reservation/?member_id=" + memberID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Reservation[];
                        resolve(resdata.map((re) => buildReservation(re)));
                    } else {
                        console.log(res);
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static memberLogin = (username: string, password: string) => {
        return new Promise<{ user: Member; token: string }>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch(
                "/member/login",
                "POST",
                JSON.stringify({
                    username: username,
                    password: password,
                }),
            )
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as { user: Member; token: string };
                        resolve({
                            user: buildMember(resdata.user),
                            token: res.token,
                        });
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static memberRegister = (data: RegisterRequestBody) => {
        const requestBody: any = data;
        requestBody.birthday = data.birthday.getTime() / 1000;
        return new Promise((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/member/register", "POST", JSON.stringify(requestBody))
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Member;
                        resolve(buildMember(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getAllTherapist = () => {
        return new Promise<Therapist[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/therapist/", "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Therapist[];
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getAvalibleTime = (time: Date, duration: number, therapist?: string) => {
        if (
            time.getFullYear() !== new Date().getFullYear() ||
            time.getMonth() !== new Date().getMonth() ||
            time.getDate() !== new Date().getDate()
        ) {
            time.setHours(0, 0, 0);
        }
        let queryParams = "?time=" + Math.round(time.getTime() / 1000);
        queryParams += "&duration=" + duration;
        if (therapist) queryParams += "&therapist_id=" + therapist;
        return new Promise<Date[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/reservation/new" + queryParams, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Date[];
                        resolve(resdata.map((d) => new Date(+(d + "000"))));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static getAllEvents = () => {
        return new Promise<Event[]>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/event/", "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Event[];
                        resolve(resdata.map((e) => buildEvent(e)));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    static createReservation = (startTime: Date, services: Service[], addressID: ObjectID, therapistID?: ObjectID) => {
        return new Promise<Reservation>((resolve, reject) => {
            let requestBody;
            if (therapistID) {
                requestBody = JSON.stringify({
                    services_id: services.map((s) => s.id),
                    address: addressID,
                    therapist_id: therapistID,
                    start_time: Math.round(startTime.getTime() / 1000),
                });
            } else {
                requestBody = requestBody = JSON.stringify({
                    services_id: services.map((s) => s.id),
                    address: addressID,
                    start_time: Math.round(startTime.getTime() / 1000),
                });
            }

            let ok = false;
            let resdata;
            authedFetch("/reservation/new", "POST", requestBody)
                .then((res) => {
                    ok = res.status === 201;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Reservation;
                        resolve(buildReservation(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    static createAddress = (data: { city: string; district: string; detail: string; note: string }) => {
        return new Promise<Address>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/member/address/", "POST", JSON.stringify(data))
                .then((res) => {
                    ok = res.status === 201;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Address;
                        resolve(resdata);
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    static createOrder = (amount: number) => {
        return new Promise<Order>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/order/", "POST", JSON.stringify({ amount: amount }))
                .then((res) => {
                    ok = res.status === 201;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Order;
                        resolve(buildOrder(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    static getReservationData = (reservationID: string) => {
        return new Promise<Reservation>((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/reservation/" + reservationID, "GET")
                .then((res) => {
                    ok = res.ok;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resdata = res as Reservation;
                        resolve(buildReservation(resdata));
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    };

    static deleteAddress = (addressID: string) => {
        return new Promise((resolve, reject) => {
            let ok = false;
            let resdata;
            authedFetch("/member/address/" + addressID, "DELETE")
                .then((res) => {
                    ok = res.status === 201;
                    return res.json();
                })
                .then((res) => {
                    if (ok) {
                        resolve();
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                })
                .catch((err) => reject(err));
        });
    };

    static getPaymentPage = (amount: number) => {
        return new Promise<string>((resolve, reject) => {
            authedFetch("/order/", "POST", JSON.stringify({ amount: amount }))
                .then((res) => res.text())
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
}

interface RegisterRequestBody {
    username: string;
    // eslint-disable-next-line camelcase
    real_name: string;
    password: string;
    gender: "男" | "女" | "其他";
    cellphone: string;
    email: string;
    birthday: Date;
}
