import { Component, ViewChild } from '@angular/core';
import { MenuPage } from '../menu/menu';
import { ApiaiService } from '../../app/services/apiai.service';
import { MovieService } from '../../app/services/movie.service';
import { NavController, ModalController, Modal, Platform, ViewController, Gesture } from 'ionic-angular';
import { M2EService } from "../../app/services/m2e.service";
import { AnalyticsService } from "../../app/services/analytics.service";
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
    private m2e: M2EService,
    private analytics: AnalyticsService)
  {
  }

  ngOnInit() {
    console.log("OnInit Ran...");
    this.analytics.loadImages();
    this.movieService.getMovies().subscribe(response => {
      this.movieService.setSelectedMovie(response.movie);
      this.selectedMovie = this.movieService.getSelectedMovie();
    });
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  showMenu() {
    this.goToPage(MenuPage);
  }

  presentModal() {
    if (!this.modalShowing) {
      this.modal = this.modalCtrl.create(MenuPage, {}, { showBackdrop: false });
      this.modal.onDidDismiss(() => this.modalShowing = false)
      this.modal.present();
      this.modalShowing = true;
    }
  }



  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowUp":
        this.presentModal();
        this.analytics.analyzeImage();
        this.m2e.postData(
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

      default:
        break;
    }
  }

  goToPage(page: Component) {
    this.navCtrl.push(page, {animation: "md-transition"});
  }

}
