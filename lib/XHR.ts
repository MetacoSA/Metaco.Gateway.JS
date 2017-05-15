import * as Q from "Q";

export class Header {
    header: string;
    data: string;
    constructor(header: string, data: string) {
        this.header = header;
        this.data = data;
    }
}

export class Data {
    Headers: string;
    Body: string;
    Text: string;
    Type: string;
    Status: number;
    StatusText: string;
}

function DataFromJSXHR(jsXHR: XMLHttpRequest): Data {
    var data = new Data();
    data.Headers = jsXHR.getAllResponseHeaders();
    data.Body = jsXHR.response;
    data.Text = jsXHR.responseText;
    data.Type = jsXHR.responseType;
    data.Status = jsXHR.status;
    data.StatusText = jsXHR.statusText;
    return data;
}

function SendCommand(
    method: string,
    url: string,
    headers: Array<Header>,
    data: string = ""): Q.Promise<Data> {

    var defer = Q.defer<Data>();

    var jsXHR = new XMLHttpRequest();
    jsXHR.open(method, url);

    if (headers != null)
        headers.forEach(header =>
            jsXHR.setRequestHeader(header.header, header.data));

    jsXHR.onload = (ev) => {
        if (jsXHR.status < 200 || jsXHR.status >= 300) {
            defer.reject(DataFromJSXHR(jsXHR));
        }
        defer.resolve(DataFromJSXHR(jsXHR));
    }
    jsXHR.onerror = (ev) => {
        defer.reject('Error ' + method.toUpperCase() + 'ing data to url "' + url + '", check that it exists and is accessible');
    };

    if (method == 'POST')
        jsXHR.send(data);
    else
        jsXHR.send();
    return defer.promise;
}
export function Get(
    url: string,
    headers: Array<Header> = []): Q.Promise<Data> {

    return SendCommand('GET', url, headers);
}

export function Post(
    url: string,
    data: string = "",
    headers: Array<Header> = []): Q.Promise<Data> {

    return SendCommand('POST', url, headers, data);
}
