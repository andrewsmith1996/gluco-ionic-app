import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { DiabetesDataProvider } from '../../providers/diabetes-data/diabetes-data';
import { DatetimeFormatProvider } from '../../providers/datetime-format/datetime-format';

import { isRightSide } from 'ionic-angular/umd/util/util';
import { ThrowStmt } from '@angular/compiler';

@IonicPage()
@Component({
  selector: 'page-recommendation-detail',
  templateUrl: 'recommendation-detail.html',
})

export class RecommendationDetailPage {

	recommendation:any = {};
	pattern:any = {};
	pattern_causes:any[] = [];
	bloodGlucoseResults:any[] = [];
	frequency:number = 0;
    in_progress:boolean = false;
    loadingSpinner:any;

	constructor(public navCtrl: NavController, private diabetesData: DiabetesDataProvider,  private datetimeProvider: DatetimeFormatProvider, private loadingCtrl: LoadingController, public navParams: NavParams, private toastCtrl: ToastController) {
	
		// Get the navigation parameter
        this.recommendation = this.navParams.get('recommendation');
        
        // Show the loading spinner
		this.loadingSpinner = this.loadingCtrl.create({
			content: "Loading..."
        });

        this.loadingSpinner.present();

		// Get the pattern data
		this.diabetesData.get_pattern_by_id(this.navParams.get('recommendation').patternID)
		.subscribe(patternData => {

			// Initialise the pattern
			this.pattern = patternData;

			// Get all the blood glucose event IDs
			let blood_glucose_events = patternData['blood_glucose_results'];
            let items_processed = 0;
            
            // Go through all IDs and get the blood glucose information
			blood_glucose_events.forEach((item) => {
				this.diabetesData.get_blood_glucose_by_id(item).subscribe((bgData => {
                    items_processed++
                    this.bloodGlucoseResults.push(bgData);
                    
                    if(items_processed == blood_glucose_events.length){
                        this.loadingSpinner.dismiss();
                    }
                }));
			});

			this.diabetesData.check_for_pattern_causes(this.navParams.get('recommendation').patternID).subscribe((causes => {
				
				let day_time: string = "";

				if(causes.day){
					day_time += (causes.day + " ");
				}

				day_time += (causes.meal);

				if(causes.low_carb){
					this.pattern_causes.push("Low Carbohydrate - " + day_time);
				}

				if(causes.high_carb){
					this.pattern_causes.push("High Carbohydrate - " + day_time);
				}

				if(causes.high_activity){
					this.pattern_causes.push("High Activity Level - " + day_time);
				}

				if(causes.low_activity){
					this.pattern_causes.push("Low Activity Level - " + day_time);
				}

				if(causes.high){
					this.pattern_causes.push("Not enough insulin at " + day_time);
				}

				if(causes.low){
					this.pattern_causes.push("Too much insulin at " + day_time);
                }
			}));
	  	}, error => {
			
			console.log(error);
			
			// Unable to add blood glucose result 
			let toast = this.toastCtrl.create({
				message: "Sorry, but there's been an error getting your recommendation.",
				duration: 3000,
				position: 'top'
			});
			
			toast.present();
			
		});

	}

	markAsSeen(){

		this.diabetesData.mark_recommendation_as_seen(this.recommendation._id).subscribe(result => {
		
			if(result){

				let toast = this.toastCtrl.create({
					message: 'Recommendation updated',
					duration: 3000,
					position: 'top'
				});
				
				toast.present();

				this.recommendation.seen = true;

			} else {
				
				let toast = this.toastCtrl.create({
					message: 'Error updating recommendation',
					duration: 3000,
					position: 'top'
				});
				
				toast.present();
			}
		}, error => {
			
			console.log(error);
			
			// Unable to add blood glucose result 
			let toast = this.toastCtrl.create({
				message: 'Error updating recommendation',
				duration: 3000,
				position: 'top'
			});
			
			toast.present();
			
		});
	}

}
