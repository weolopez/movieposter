import {Injectable} from "@angular/core";
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Injectable()

export class AnalyticsService{
    private posterid = 'kelleytest';
    analyticsList: FirebaseListObservable<any>;

  constructor(private af: AngularFire) {
    this.analyticsList = af.database.list('/analytics/'+this.posterid);
  }

}
