export class HttpApi {

    static GET(url, suc: Function, err: Function, connected: Function = null) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    suc(response);
                }
                else {
                    if (err["hasInvoke"] === undefined) {
                        err["hasInvoke"] = "hasInvoke";
                        err();
                    }
                }
            } else if (xhr.readyState == 1) {
                if (connected != null)
                    connected()
            } else {
                console.log("Get-error:", xhr.readyState)
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.timeout = 10 * 1000;
        xhr.ontimeout = function () {
            if (err["hasInvoke"] === undefined) {
                err["hasInvoke"] = "hasInvoke";
                err();
            }
        };
        xhr.onerror = function () {
            if (err["hasInvoke"] === undefined) {
                err["hasInvoke"] = "hasInvoke";
                err();
            }
        };
        xhr.send();
    }

    static POST(url, data, suc?: Function, err?: Function) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    suc(response);
                }
                else {
                    err();
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data/* getLXBSign(data) */);

        function getLXBSign(params: any/*ObjectURLOptions*/) {
            var para_filter = [];
            for (var key in params) {
                var value: any = params[key];
                para_filter.push(key + "=" + value + "&");
            }
            para_filter.sort();
            var arg_1 = para_filter.join('');
            var arg: string = '';
            for (var key in para_filter) {
                arg += para_filter[key];
            }

            return arg;
        }
    }

    static sortParms(params) {
        var para_filter = [];
        for (var key in params) {
            var value: any = params[key];
            para_filter.push(key + "=" + value + "&");
        }
        para_filter.sort();
        var arg_1 = para_filter.join('');
        var arg: string = '';
        for (var key in para_filter) {
            arg += para_filter[key];
        }
        var arg2 = arg.slice(0, arg.length - 1);
        return arg2;
    }

    static encode(data: any): string {
        let paramURL: string = '';
        for (let key in data) {
            paramURL += `${key}=${data[key]}&`
        }
        if (paramURL.length > 1) {
            return `${paramURL.substring(0, paramURL.length - 1)}`
        }
        return paramURL;
    }


    static promisePOST(url, data) {
        return new Promise<any>((resolve: Function, reject: Function) => {
            this.POST(url, data, resolve, reject);
        });
    }

    static promiseGET(url) {
        return new Promise<any>((resolve: Function, reject: Function) => {
            this.GET(url, resolve, reject);
        });
    }
}