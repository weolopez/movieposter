import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

import { MovieService } from '../../app/services/movie.service';

@Component({
  selector: 'page-trailer',
  templateUrl: 'trailer.html'
})

export class TrailerPage {
  private unregisterKeyboardListener;

  public selectedMovie;

  constructor(public navCtrl: NavController, public platform: Platform, public sanitizer: DomSanitizer, private movieService: MovieService) {

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
  getSafeTrailerUrl() {
    let safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedMovie.trailerUrl + "?autoplay=1");
    return safeUrl;
  }

}
