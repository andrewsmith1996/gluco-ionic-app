import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ToastController} from 'ionic-angular';

import { RecommendedDosePage }  from '../recommended-dose/recommended-dose';
import { DiabetesDataProvider } from '../../providers/diabetes-data/diabetes-data';
import { DatetimeFormatProvider } from '../../providers/datetime-format/datetime-format';
import { RecommendationDetailPage } from '../recommendation-detail/recommendation-detail';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
	selector: 'page-add',
	templateUrl: 'add_blood_sugar.html',
})

export class AddBloodSugarPage {

	// Initialise variables
	diary_entry = <any>{};
	datetime: any = new Date();
	date:string = this.getDateString();
	time:string = this.getTimeString();
	recommendation_enabled: boolean = false;
	
	constructor(
		public navCtrl: NavController, 
		private diabetesData: DiabetesDataProvider, 
		private datetimeProvider: DatetimeFormatProvider, 
		public modalCtrl: ModalController, 
		private toastCtrl: ToastController,
		private settingsProvider: SettingsProvider,
		private alertCtrl: AlertController
	){}

	ionViewDidEnter(){

		// Initialise the date
		this.datetime = new Date();
		this.date = this.getDateString();
		this.time = this.getTimeString();

		// Get the current hour
		const hour = this.datetime.getHours();

		// Automatically set the mealtime input
		if(hour >= 7 && hour < 12){
			this.diary_entry.meal = "breakfast";
		} else if(hour >= 12 && hour < 16){
			this.diary_entry.meal = "lunch";
		} else if(hour >= 16 && hour < 21){
			this.diary_entry.meal = "dinner";
		} else if(hour >= 21 && hour < 24){
			this.diary_entry.meal = "bed";
		} else {
			this.diary_entry.meal = "breakfast";
		}
	}

	addNewBloodSugar(){

		// Do we have all the correct details?
		if(!this.checkValidBloodSugar()){

			// We don't have correct details, inform the user
			this.presentError();

		} else {

			// We do have correct details so initialise the datetime for this entry
			this.diary_entry.datetime = this.datetime;
	
			// Get the plaintext day
			var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			this.diary_entry.day = days[this.datetime.getDay()];

			// Add the diary entry
			this.diabetesData.add_diary_entry(this.diary_entry)
			.subscribe(data => {

				if(data.success){
					
					// Successfully added
					let toast = this.toastCtrl.create({
						message: 'New Blood Glucose added.',
						duration: 3000,
						position: 'top'
					});
					
					toast.present();

					// Reset the form inputs
					this.diary_entry.bg_level = "";
					this.diary_entry.insulin_dose = "";
					this.diary_entry.physical_activity = "";
					this.diary_entry.carb_consumption = "";

					// Check for recommendations
					this.diabetesData.refresh_recommendations()
					.subscribe(result => {

                        if(result.daily_pattern_found){
                            let alert = this.alertCtrl.create({
                                title: 'New Daily Pattern',
                                message: 'A new day recommendation is available. Head over to the recommendations tab to view it.',
                                buttons: ['Dismiss']
                            });
    
                            alert.present();
                        }

                        if(result.meal_pattern_found){
                            let alert = this.alertCtrl.create({
                                title: 'New Meal Pattern',
                                message: 'A new meal recommendation is available. Head over to the recommendations tab to view it.',
                                buttons: ['Dismiss']
                            });
    
                            alert.present();
                        }


						this.diabetesData.check_for_fixed_patterns()
						.subscribe(result => {
							if(result.patterns_fixed.length > 0){
								
								let alert = this.alertCtrl.create({
									title: 'Fixed Pattern',
									message: 'Congratulation, you fixed a pattern. View Pattern?',
									buttons: [{
										text: 'No',
										role: 'cancel'
									},{
										text: 'Yes',
										handler: () => {
											this.navCtrl.push(RecommendationDetailPage, {
												recommendation:result.recommendation
											});
										}
									}]
								});

								alert.present();
							}
						}, error => {

							console.log(error);
							toast.present();

						});
					}, error => {

						console.log(error);

						this.presentError();
					});

				} else {
					this.presentError();
				}
			}, error => {
				console.log(error);
				this.presentError();
			});
		}
	}

	checkValidBloodSugar(): boolean {

		let valid: boolean = true;
		
		if(
			this.diary_entry.bg_level == null || 
			this.diary_entry.insulin_dose == null || 
			this.diary_entry.meal == null ||
			this.diary_entry.bg_level <= 1 ||
			this.diary_entry.bg_level >= 40 ||
			this.diary_entry.insulin_dose == 0 ||
			this.diary_entry.insulin_dose >= 50 ||
			this.diary_entry.physical_activity >= 180 ||
			this.diary_entry.carb_consumption >= 1000
			){
			valid = false;
		}

		return valid;
	}

	presentError(){

		// Unable to add blood glucose result 
		let toast = this.toastCtrl.create({
			message: "There's been an error. Please make sure all details have been entered correctly.",
			duration: 3000,
			position: 'top'
		});
		
		toast.present();
	}

	getDateString(): string{
		
		let monthNames: string[] = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
	
		var day = this.datetime.getDate();
		var monthIndex = this.datetime.getMonth();
		var year = this.datetime.getFullYear();

	
		return (day < 10 ? '0' + day : day) + ' ' + monthNames[monthIndex] + ' ' + year;
	}

	getTimeString(): string{
		return (this.datetime.getHours() < 10 ? '0' + this.datetime.getHours() : this.datetime.getHours()) 
		+ ':' + (this.datetime.getMinutes() < 10 ? '0' + this.datetime.getMinutes() : this.datetime.getMinutes())
	}

	getRecommendedDose(){
		return this.diabetesData.get_recommended_dose(this.diary_entry);
	}

	checkRecommendationEnabled(event){
		if(this.diary_entry.bg_level != null && this.diary_entry.meal != null && this.diary_entry.physical_activity != null && this.diary_entry.carb_consumption != null){
			this.recommendation_enabled = true;
		}
	}

	presentRecommendedDoseModal() {
		this.getRecommendedDose().subscribe(data => {

			if(data['success']){

				this.diary_entry.datetime = this.datetime;
		
				// Get the plaintext day
				var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				this.diary_entry.day = days[this.datetime.getDay()];
		
				// Create the modal
				let profileModal = this.modalCtrl.create(RecommendedDosePage, { originalData: this.diary_entry, recommendationData: data['recommended_dose'] });
				
				// Add an event listener for when the modal is closed
				profileModal.onDidDismiss(modal_data => {
					
					// Add the recommended insulin dose
					this.diary_entry.insulin_dose = Math.round(modal_data.dose);
	
					// Create a toast message
					let toast = this.toastCtrl.create({
						message: "Insulin recommendation added.",
						duration: 3000,
						position: 'top'
					});

					toast.present();
				});

				// Present modal  
				profileModal.present();

			} else {
			
				// Get the ICR from the local storage settings
				const ICR = this.settingsProvider.getICR();
				
				if(ICR){
					
					// Calculate dose with ICR
					this.diary_entry.insulin_dose = Number(ICR) / this.diary_entry.carb_consumption;
					
					let toast = this.toastCtrl.create({
						message: "No similar cases found. Initialised with ICR.",
						duration: 3000,
						position: 'top'
					});

					toast.present();

				} else {
					
					let toast = this.toastCtrl.create({
						message: "No ICR set. Please set your ICR in settings to use this feature.",
						duration: 3000,
						position: 'top'
					});

					toast.present();
				}

			}

		}, error => {
			
			console.log(error);
			this.presentError();
		});
	}	
}