import {Injectable} from "@angular/core";
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Injectable()

export class AnalyticsService{
    private posterid = 'kelleytest0';
    bluemixList: FirebaseListObservable<any>;
    speechList: FirebaseListObservable<any>;

  constructor(private af: AngularFire) {
    this.bluemixList = af.database.list('/bluemix/'+this.posterid);
    this.speechList = af.database.list('/speech/'+this.posterid);
  }

  addBluemix(visualrecognition) {
    this.bluemixList.push({
      timestamp: Date.now(),
      visualrecognition: visualrecognition
    });
  }

  addSpeech(speech, action) {
    this.speechList.push({
      timestamp: Date.now(),
      speech: speech,
      action: action
    });
  }

}
