import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Movie } from "./movie.store";

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  readonly movies:  { [name: string]: Movie[] } = 
    {
      "source1": [
        { name: "Alien 1" },
        { name: "Alien 2" },
        { name: "Alien 3" },
      ],
      "source2": [
        { name: "Gostbusters 1" },
        { name: "Gostbusters 2" },
        { name: "Gostbusters 3" },
      ]
    };
  

  constructor() { }

  get(source: string): Observable<Movie[]> {
    return of(this.movies[source]);
  }
}