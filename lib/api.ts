import { PostOrderRequest } from "./PostOrderRequest";
import * as XHR from "./XHR";

export class PostOrderResponse {
    orderId: string;
    customReference: string;
}

export class GatewayError {
    location: string;
    message: string;
    statusCode: number;
}

export class TransactionInformation {
    transactionId: string;
    transaction: string;
    amountCurrency: number;
    miningFee: number;
    miningFeeCurrency: number;
    quote: number;
    baseCurrency: string;
    amount: number;
}

export class OrderInformation {
    id: string;
    request: PostOrderRequest;
    transactionInformation: TransactionInformation;
    errorCode: string;

    //Requested, Processed, Cancelled
    state: string;
}

export class ApiClient {
    _Url: string;
    _Credentials: string;
    constructor(url: string, credentials: string) {
        this._Url = url;
        this._Credentials = credentials;
    }

    createHeaders() {
        return [
            new XHR.Header("Authorization", "Bearer " + this._Credentials),
            new XHR.Header("Content-Type", "application/json")
        ];
    }

    public async PostOrder(req: PostOrderRequest): Promise<PostOrderResponse> {
        var response = await XHR.Post(this._Url + "/liquidity/order", JSON.stringify(req), this.createHeaders());
        if (response.Status != 200)
            throw JSON.parse(response.Text);
        return JSON.parse(response.Text);
    }

    public async GetOrder(id: string): Promise<OrderInformation> {
        var response = await XHR.Get(this._Url + "/liquidity/order/" + id, this.createHeaders());
        if (response.Status != 200)
            throw JSON.parse(response.Text);
        return JSON.parse(response.Text);
    }
}