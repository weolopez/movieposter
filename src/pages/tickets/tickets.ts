import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { MovieService } from '../../app/services/movie.service';

@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html'
})

export class TicketsPage {
  @ViewChild('purchaseButton') purchaseButton;
  @ViewChild('changeButton') changeButton;
  @ViewChild('cancelButton') cancelButton;

  private unregisterKeyboardListener;
  public selectedMovie = {};
  public currentPage = 1;
  public amounts = [1,2,3,4,5,6,7,8,9,10];
  public selectedButton = 1;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public movieService: MovieService,
    public changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.selectedMovie = this.movieService.getSelectedMovie();
    this.currentPage = 1;
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  tryToDetectChanges() {
    try {
      this.changeDetector.detectChanges();
    } catch (error) {
      console.log(error);
    }
  }

  changeFocus(direction) {
    if (direction=="right") {
      this.selectedButton++;
      if (this.selectedButton>3) this.selectedButton=1;
    } else {
      this.selectedButton--;
      if (this.selectedButton<1) this.selectedButton=3;
    }
  }

  getNow() {
    return Date.now();
  }

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowDown":
        if (this.currentPage==1) {
          this.navCtrl.pop({animation: "md-transition"});
        } else {
          this.currentPage--;
          if (this.currentPage<1) this.currentPage = 1;
          this.tryToDetectChanges();
        }
        break;

      case "ArrowUp":
        this.currentPage++;
        if (this.currentPage>4) this.navCtrl.pop({animation: "md-transition"});
        this.tryToDetectChanges();
        break;

      case "ArrowRight":
        this.changeFocus("right");
        break;

      case "ArrowLeft":
        this.changeFocus("left");
        break;

      default:
        break;
    }
  }

}
