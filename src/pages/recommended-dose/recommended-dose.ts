import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { DatetimeFormatProvider } from '../../providers/datetime-format/datetime-format';

/**
 * Generated class for the RecommendedDosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recommended-dose',
  templateUrl: 'recommended-dose.html',
})
export class RecommendedDosePage {

  originalData:any;
  recommendedDoseData:any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private datetimeProvider: DatetimeFormatProvider, public navParams: NavParams) {
    
    this.originalData = this.navParams.get('originalData');
    this.recommendedDoseData = this.navParams.get('recommendationData');
  
  }

  ionViewDidLoad() {

  }

  acceptRecommendedDose(){
    this.viewCtrl.dismiss({dose:this.recommendedDoseData.insulin_dose, new_case:true});
  }

  declineRecommendedDose(){
    
    // Get the ICR to initialise a new case
    const ICR = 10;
    let insulin_dose = this.originalData.carb_consumption / ICR;
    
    this.viewCtrl.dismiss({dose:insulin_dose, new_case:false});
  
  }

}
