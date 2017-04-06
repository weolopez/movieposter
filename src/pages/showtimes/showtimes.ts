import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { MovieService } from '../../app/services/movie.service';

@Component({
  selector: 'page-showtimes',
  templateUrl: 'showtimes.html'
})

export class ShowTimesPage {
  private unregisterKeyboardListener;
  public selectedMovie = {};

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public movieService: MovieService
  ) {
  }

  ngOnInit() {
        this.selectedMovie = this.movieService.getSelectedMovie();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowDown":
        this.navCtrl.pop({animation: "md-transition"});
        break;

      default:
        break;
    }
  }

}
