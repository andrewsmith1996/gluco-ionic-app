import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DatetimeFormatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatetimeFormatProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DatetimeFormatProvider Provider');
  }

  transform_date(date): string{

	  // Create the data timestamp
	  let date_object = new Date(date);
  
	  // Get the month strings
	  let monthNames: string[] = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	  ];
	
	  // Decompose the date down into its objects
	  let day = date_object.getDate();
	  let monthIndex = date_object.getMonth();
	
	  // Return the formatted date
	  return (day < 10 ? '0' + day : day) + ' ' + monthNames[monthIndex] + ' ' + date_object.getFullYear();
  
	}  

	transform_time(time): string{

	  // Create the time stamp
	  let time_object = new Date(time);
  
	  // Return the formatted date
	  return (time_object.getHours() < 10 ? '0' + time_object.getHours() : time_object.getHours()) + ':' + (time_object.getMinutes() < 10 ? '0' + time_object.getMinutes() : time_object.getMinutes())
  
	}


}
