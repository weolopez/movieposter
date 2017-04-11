import { Component, ViewChild } from '@angular/core';
import { MenuPage } from '../menu/menu';
import { InstructionsPage } from '../instructions/instructions';
import { ApiaiService } from '../../app/services/apiai.service';
import { MovieService } from '../../app/services/movie.service';
import { NavController, ModalController, Modal, Platform, ViewController, Gesture } from 'ionic-angular';
import { AnalyticsService } from "../../app/services/analytics.service";
import { M2XService } from "../../app/services/m2x.service";
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private modal: Modal;
  private modalShowing: Boolean;
  private unregisterKeyboardListener;

  public selectedMovie = {};

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public viewCtrl: ViewController,
    private apiaiService: ApiaiService,
    private movieService: MovieService,
    private m2x: M2XService,
    private analytics: AnalyticsService)
  {
    this.getMovie();
  }

  ngOnInit() {
    console.log("OnInit Ran...");
    this.analytics.loadImages();
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  getMovie() {
      this.movieService.getMovie().subscribe( r => {
        r.subscribe( movie =>{
        console.log('getting movie')
        console.dir(movie);
            this.selectedMovie = movie
        })
      })
  }

  showMenu() {
    this.goToPage(MenuPage);
  }

  presentModal(page) {
    if (!this.modalShowing) {
      this.modal = this.modalCtrl.create(page, {}, { showBackdrop: false });
      this.modal.onDidDismiss(() => {
        this.getMovie();
        this.modalShowing = false
      })
      this.modal.present();
      this.modalShowing = true;
    }
  }



  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowUp":
        this.presentModal(MenuPage);
        this.analytics.analyzeImage();
        this.m2x.postData(
          {
            "timestamp":  new Date().toISOString(),
            "values": {
              "movieName": this.selectedMovie['title']
            }
          }
        ).subscribe((result) => {
          console.log(result);
        }, (error) => {
          console.log(error);
        });
        break;

      case "Escape":
        this.navCtrl.pop({ animation: "md-transition" });
        break;

      case " ":
        this.presentModal(InstructionsPage);
        break;

      default:
        break;
    }
  }

  goToPage(page: Component) {
    this.navCtrl.push(page, {animation: "md-transition"});
  }

}
