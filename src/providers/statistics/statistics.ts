import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _throw as throwError } from 'rxjs/observable/throw';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class StatisticsProvider {

	API_URL: String = "API_KEY";

	constructor(public http: HttpClient) {
	
  	}

   	get_averages(){
		return this.http.get(this.API_URL + '/get_averages')
		.pipe(retry(3), catchError(this.handleError));
	}

	get_blood_glucose_by_level(){
		return this.http.get(this.API_URL + '/get_results_by_level')
		.pipe(retry(3), catchError(this.handleError));
	}
	
	get_averages_by_time(){
		return this.http.get(this.API_URL + '/get_average_by_time')
		.pipe(retry(3), catchError(this.handleError));
	}

	get_lows_by_meal(){
		return this.http.get(this.API_URL + '/get_lows_by_meal')
		.pipe(retry(3), catchError(this.handleError));
	}

	get_highs_by_meal(){
		return this.http.get(this.API_URL + '/get_highs_by_meal')
		.pipe(retry(3), catchError(this.handleError));
	}

	get_median_by_time(){
		return this.http.get(this.API_URL + '/get_median_by_time')
		.pipe(retry(3), catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          
            // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);

        } else {
          
        // The backend returned an unsuccessful response code.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }

        // return an observable with a user-facing error message
        return throwError('Something went wrong; please try again later.');
    };
}
