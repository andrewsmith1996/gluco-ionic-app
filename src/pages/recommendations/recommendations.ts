import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Toast } from 'ionic-angular';
import { RecommendationDetailPage } from '../recommendation-detail/recommendation-detail';

import { DiabetesDataProvider } from '../../providers/diabetes-data/diabetes-data';

@Component({
  selector: 'page-recommendations',
  templateUrl: 'recommendations.html'
})

export class RecommendationsPage {

	recommendations:any;
	loadingSpinner:any;

  	constructor(public navCtrl: NavController, private diabetesData: DiabetesDataProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
        
        // Show the loading spinner
		this.loadingSpinner = this.loadingCtrl.create({
			content: "Loading..."
        });

        this.loadingSpinner.present();
       
        // Refresh the recommendations
		this.diabetesData.refresh_recommendations().subscribe(result => {
			if(result.success){
                this.getRecommendations();
			}
		}, error => {
            console.log(error);
        });
	}

  	ionViewDidEnter(){
      
        
  	}

	viewDetail(recommendation){
		this.navCtrl.push(RecommendationDetailPage, {
			recommendation:recommendation,
		});
	}

	getRecommendations(){

		// Get the blood glucose data
		this.diabetesData.get_recommendations().subscribe(data => { 
            
			// Initialise blood glucose data
            this.recommendations = data;
            
            this.loadingSpinner.dismiss();

		}, error => {
		
			console.log(error);
			
			// Unable to get recommendations
			let toast = this.toastCtrl.create({
				message: "Sorry, but we're unable to get your recommendations.",
				duration: 3000,
				position: 'top'
			});
			
            toast.present();
            
            this.loadingSpinner.dismiss();
			
		});
	}

	refreshRecommendations(event){
		this.diabetesData.refresh_recommendations().subscribe((result) => {
			if(result){
				this.getRecommendations();
				event.complete();
			}
		});
	}
}
