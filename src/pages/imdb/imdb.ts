import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { MovieService } from '../../app/services/movie.service';

@Component({
  selector: 'page-imdb',
  templateUrl: 'imdb.html'
})

export class ImdbPage {
  public selectedMovie;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public movieService: MovieService
  ) {

  }

  ngOnInit() {
    this.selectedMovie = this.movieService.getSelectedMovie();
  }


}
