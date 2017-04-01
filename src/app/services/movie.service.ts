import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()

export class MovieService{
    accessToken: String;
    movieUrl: string;
    private selectedMovie: any;

    constructor(private http: Http) {
        this.movieUrl = "../../assets/json/movies.json";
    }

    getMovies() {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8',
                                    "Authorization": "Bearer " + this.accessToken });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.movieUrl, options)
            .map(res => res.json())
            .catch(this.handleError);
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
