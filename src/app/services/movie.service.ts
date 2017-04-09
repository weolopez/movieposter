import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

import { AngularFire } from 'angularfire2';
import { M2EService } from "./m2e.service";

@Injectable()

export class MovieService{
    accessToken: String;
    movieUrl: string;
    private selectedMovie: any;
    private posterid: string;
    private movieid = '-Kh-0hs6tqHEqRbreDIK';
    constructor(private http: Http, 
                private m2e: M2EService,
                private af: AngularFire) {
        this.posterid = m2e.getPosterId();
        console.log('PosterID::'+this.posterid);

        this.posterid = localStorage.getItem('movieid');
        m2e.getMovieId().subscribe( response => this.setMovieId(response.json()), error => m2e.putMovieId(this.movieid) );
    }

    setMovieId(r) {
      console.dir(r);
      if (r.movieid) {
        localStorage.setItem('movieid', r.movieid);
        this.movieid = r.movieid;
      } 
    }
    getMovies() {
      return this.af.database.object('/movies/'+this.movieid)
    }

    handleError(error:any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Movie Server error');
    }

    setSelectedMovie(movie: any) {
      this.selectedMovie = movie;
    }

    getSelectedMovie() {
      return this.selectedMovie || {};
    }
}