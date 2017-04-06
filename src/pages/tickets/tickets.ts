import { Component, ChangeDetectorRef } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { MovieService } from '../../app/services/movie.service';

@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html'
})

export class TicketsPage {
  private unregisterKeyboardListener;
  public selectedMovie = {};
  public currentPage = 1;
  public amounts = [1,2,3,4,5,6,7,8,9,10];

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

      default:
        break;
    }
  }

}
