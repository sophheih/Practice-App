type ParamList = {
    ServiceDetail: {
        serviceID: string;
    };
    會員儲值: {
        amount: number;
    };
    ReservationDetail: {
        reservationID: string;
    };
    會員資訊: {
        shouldRefresh: boolean;
    }
};

export default ParamList;
