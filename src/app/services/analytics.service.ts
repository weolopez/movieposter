import {Injectable} from "@angular/core";
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {PosterService} from "./poster.service";
import { BluemixService } from './bluemix.service';
import { FacesService } from './faces.service';
import { M2EService } from "./m2e.service";



@Injectable()

export class AnalyticsService{
    private posterid;
    bluemixList: FirebaseListObservable<any>;
    speechList: FirebaseListObservable<any>;
    identities: FirebaseListObservable<any>;
    private images : any;


  constructor(private af: AngularFire, 
              private poster: PosterService, 
              private faces: FacesService, 
              private m2x: M2EService, 
              private bluemixService: BluemixService) {
    //this.posterid = poster.getPosterID;
    this.posterid = "kelleytest0";
    this.bluemixList = af.database.list('/bluemix/'+this.posterid);
    this.speechList = af.database.list('/speech/'+this.posterid);
    this.identities = af.database.list('/identities/'+this.posterid);
    this.images = [];
  }

  ngOnInit() {
    this.loadImages();
  }

  addBluemix(visualrecognition) {
    this.bluemixList.push({
      timestamp: Date.now(),
      visualrecognition: visualrecognition
    });
  }

  addSpeech(speech, action) {
    this.m2x.postData({
            "timestamp":  new Date().toISOString(),
            "values": {
              "intent": action,
              "speech": speech
            }
    }).subscribe((result) => {
          console.log(result);
        }, (error) => {
          console.log(error);
        });
    this.speechList.push({
      timestamp: Date.now(),
      speech: speech,
      action: action
    });
  }

  addIdentities(faces) {
    this.identities.push({
      timestamp: Date.now(),
      faces: faces
    });
  }


  analyzeImage()
  {
      //get random image until webcam is integrated
      let index = Math.floor(Math.random() * 5);
      let my_image = this.images[index].url;

      this.bluemixService.send(my_image).subscribe(response => {
        //console.log(response);
        if (response.images) {
          console.log(response.images[0]);
          this.addBluemix(response.images[0]);
        }
      });
      this.faces.send(my_image).subscribe(response => {
        if (response.images) {
          console.log(response.images[0].faces);
          this.addIdentities(response.images[0].faces);
        }
      });
      //TODO
      //check if identity is in KnownIdentities

  }

  loadImages() {

    this.images.push({name:'Kelley', url:'https://firebasestorage.googleapis.com/v0/b/bravehackers17.appspot.com/o/Kelley.png?alt=media&token=078fd164-c992-44be-bbab-522157289e5e'});
    this.images.push({name:'Mauricio', url:'https://firebasestorage.googleapis.com/v0/b/bravehackers17.appspot.com/o/Mauricio.jpg?alt=media&token=26d6e983-79c9-4c89-9be2-0b1b237218ca'});
    this.images.push({name:'Barack', url:'https://raw.githubusercontent.com/watson-developer-cloud/doc-tutorial-downloads/master/visual-recognition/prez.jpg'});
    this.images.push({name:'Coffee', url:'https://firebasestorage.googleapis.com/v0/b/bravehackers17.appspot.com/o/6.jpg?alt=media&token=273be677-9907-4029-a6bc-7044edc60636'});
    this.images.push({name:'Pupper', url:'https://firebasestorage.googleapis.com/v0/b/bravehackers17.appspot.com/o/5.jpg?alt=media&token=cb0da669-201c-4f23-ba29-0a35b67a0cfa'});
    this.images.push({name:'Fruit', url:'https://github.com/watson-developer-cloud/doc-tutorial-downloads/raw/master/visual-recognition/fruitbowl.jpg'});
    console.log(this.images);
}



}
