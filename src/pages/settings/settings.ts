import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {

	settings = <any>{};

	constructor(public navCtrl: NavController, public navParams: NavParams, private settingsProvider: SettingsProvider, private toastCtrl: ToastController) {
		this.settingsProvider.getICR().then((val) => {
			this.settings.icr = val;
			console.log(val);
		});
	}

	ionViewDidEnter() {
		this.settingsProvider.getICR().then((val) => {
			this.settings.icr = val;
			console.log(val);
		});
	}

	saveSettings(){
		this.settingsProvider.setICR(this.settings.icr);
	
		let toast = this.toastCtrl.create({
			message: "Settings successfully updated.",
			duration: 3000,
			position: 'top'
		}); ;
	
		// Present the toast 
		toast.present();
	}
	
	clearSettings(){
		this.settingsProvider.clearStorage();
		this.settings.icr = null;
	}

}
