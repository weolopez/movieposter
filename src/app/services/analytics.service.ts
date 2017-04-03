import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

@Injectable()

export class AnalyticsService{
    private selectedCustomer: any;
    private posterid = 'kelleytest';
    analyticsList: FirebaseListObservable<any>;

  constructor(private af: AngularFire) {
    this.analyticsList = af.database.list('/analytics/'+this.posterid);
  }

}
