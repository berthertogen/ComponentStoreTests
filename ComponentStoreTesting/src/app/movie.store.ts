import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { EMPTY, forkJoin, Observable, of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { MovieService } from "./movie.service";

export interface Movie {
  name: string;
}

export interface MoviesState {
  movies: Movie[];
  allLoaded: boolean;
}

@Injectable()
export class MovieStore extends ComponentStore<MoviesState> {
  
  constructor(private readonly movies:MovieService) {
    super({
      movies: [],
      allLoaded: false
    });
  }

  readonly loadMovies = this.effect((sources$: Observable<string[]>) => {
    return sources$.pipe(
      tap(_ => this.startLoading()),
      switchMap(sources => 
        forkJoin([
          ...sources.map(source => this.movies.get(source).pipe(
            tapResponse(
              (movies) => this.addMovies(movies),
              (error) => console.error(error)
            ),
            catchError(() => EMPTY),
          ))
        ])
      ),
      tap(_ => this.doneLoading()),
      catchError(_ => EMPTY),
    );
  });

  readonly addMovies = this.updater((state, movies: Movie[]) => ({
    ...state,
    movies: [...state.movies, ...movies],
  }));
  readonly startLoading = this.updater((state) => ({
    ...state,
    allLoaded: false
  }));
  readonly doneLoading = this.updater((state) => ({
    ...state,
    allLoaded: true
  }));

  selectMovies() {
    return this.select((state) => state.movies);
  }
  selectAllLoaded() {
    return this.select((state) => state.allLoaded);
  }
}