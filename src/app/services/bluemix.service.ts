import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()

export class BluemixService{
    http:any;
    accessToken: String;
    baseUrl: string;

    constructor(http: Http) {
        this.http = http;
        //this.apiKey = 'cc1de17e9bbfb93b8e9df6186f69c2f58ace85f0';
        this.baseUrl = "http://visual-recognition-bh.mybluemix.net/api/classify?api_key=cc1de17e9bbfb93b8e9df6186f69c2f58ace85f0&version=2016-05-20";
        //running server locally to debug
        //this.baseUrl = "http://localhost:3000/api/classify";
        
       
}

   

    send(pic: any) {
        let body = 'url=' + pic;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});

        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error:any) {
        return Observable.throw(error.json().error || 'Bluemix Server error');
    }




    

}
