import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()

export class BluemixService{
    http:any;
    accessToken: String;
    baseUrl: String;

    constructor(http: Http) {
        this.http = http;
        this.accessToken = 'cc1de17e9bbfb93b8e9df6186f69c2f58ace85f0';
        this.baseUrl = "https://gateway-a.watsonplatform.net/visual-recognition/api";
    }

   

    send(text: any) {
        let body = JSON.stringify({query: text, lang: "en", sessionId: "bravehackers"});
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8',
                                    "Authorization": "Bearer " + this.accessToken });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + "query", body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error:any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Bluemix Server error');
    }

    

}
