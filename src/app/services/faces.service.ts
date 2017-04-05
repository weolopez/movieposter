import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()

export class FacesService{
    http:any;
    accessToken: String;
    baseUrl: string;

    constructor(http: Http) {
        this.http = http;     
        this.baseUrl = "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key=cc1de17e9bbfb93b8e9df6186f69c2f58ace85f0&version=2016-05-20"
    }

   

    send(pic: any) {
        let query = '&url=' + pic
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});

        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.baseUrl + query, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error:any) {
        return Observable.throw(error.json().error || 'Bluemix Server error');
    }




    

}
