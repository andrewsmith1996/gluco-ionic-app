import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { DiabetesDataProvider } from '../../providers/diabetes-data/diabetes-data';
import { DatetimeFormatProvider } from '../../providers/datetime-format/datetime-format';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})

export class HistoryPage {

  bloodGlucoseResults:any;
  loadingSpinner:any;
  num_results:number = 0;

  	constructor(public navCtrl: NavController, private diabetesData: DiabetesDataProvider, private datetimeProvider: DatetimeFormatProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController){
		// this.getHistory();
  	}

  	ionViewDidEnter(){
		this.getHistory();
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
		var day = date_object.getDate();
		var monthIndex = date_object.getMonth();
	
		// Return the formatted date
		return (day < 10 ? '0' + day : day) + ' ' + monthNames[monthIndex];

	}

	transform_time(time): string{

		// Create the time stamp
		let time_object = new Date(time);

		// Return the formatted date
		return (time_object.getHours() < 10 ? '0' + time_object.getHours() : time_object.getHours()) + ':' + (time_object.getMinutes() < 10 ? '0' + time_object.getMinutes() : time_object.getMinutes())
	}

	getHistory(){
		
		// Show the loading spinner
		this.loadingSpinner = this.loadingCtrl.create({
			content: "Loading..."
		});

		this.loadingSpinner.present();
		  
		// Get the blood glucose data
		this.diabetesData.get_diary()
	  	.subscribe(data => { 

			// Initialise blood glucose data
			this.bloodGlucoseResults = data;

			this.num_results = data.length;

			// Hide the loading spinner 
			this.loadingSpinner.dismiss();

		}, error => {
			
			console.log(error);

			// Hide the loading spinner 
			this.loadingSpinner.present();
			
			// Unable to add blood glucose result 
			let toast = this.toastCtrl.create({
				message: "There's been an error getting your blood glucose diary.",
				duration: 3000,
				position: 'top'
			});
			
			toast.present();

			this.loadingSpinner.dismiss();
		});
	}
}