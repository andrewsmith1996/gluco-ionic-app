import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { _throw as throwError } from 'rxjs/observable/throw';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class DiabetesDataProvider {

    API_URL: String = "API_KEY";

	constructor(public http: HttpClient) {
    }

	add_diary_entry(diabetes_entry){
        return this.http.post(this.API_URL + '/add_diary_entry', diabetes_entry)
        .pipe(retry(3), catchError(this.handleError));
    }
    
    get_diary(){ 
        return this.http.get(this.API_URL + '/get_diary')
        .pipe(retry(3), catchError(this.handleError));
    }

    refresh_recommendations(){
        return this.http.get(this.API_URL + '/refresh_recommendations')
        .pipe(retry(3), catchError(this.handleError));
    }

    get_recommendations(){ 
        return this.http.get(this.API_URL + '/get_recommendations')
        .pipe(retry(3), catchError(this.handleError));
    }

    get_pattern_by_id(patternID){ 
        return this.http.get(this.API_URL + '/get_pattern_by_id/' + patternID)
        .pipe(retry(3), catchError(this.handleError));
    }

    check_for_fixed_patterns(){ 
        return this.http.get(this.API_URL + '/check_for_fixed_patterns')
        .pipe(retry(3), catchError(this.handleError));
    }

    check_for_pattern_causes(patternID){ 
        return this.http.get(this.API_URL + '/check_for_pattern_causes/' + patternID)
        .pipe(retry(3), catchError(this.handleError));
    }
    
    get_blood_glucose_by_id(id){ 
        return this.http.get(this.API_URL + '/get_blood_glucose_by_id/' + id)
        .pipe(retry(3), catchError(this.handleError));
    }

    mark_recommendation_as_seen(id){ 
        return this.http.get(this.API_URL + '/mark_recommendation_as_seen/' + id)
        .pipe(retry(3), catchError(this.handleError));
    }

    get_unseen_recommendations(){ 
        return this.http.get(this.API_URL + '/get_unseen_recommendations')
        .pipe(retry(3), catchError(this.handleError));
    }

    get_recommended_dose(diabetes_entry){
        return this.http.post(this.API_URL + '/get_recommended_dose', diabetes_entry)
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
