import { Component } from '@angular/core';
import { Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

// Ionic Native network connectivity manager
import { Network } from '@ionic-native/network';

// Local storage
import { Storage } from '@ionic/storage';

// Loader
import { LoadingController } from 'ionic-angular'

import { IntroductionPage } from '../pages/introduction/introduction';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	  rootPage:any = TabsPage;
	  loader: any;

  	constructor(platform: Platform, public loadingCtrl: LoadingController, statusBar: StatusBar, splashScreen: SplashScreen, private network: Network, private toastCtrl: ToastController, public storage: Storage) {
		
		this.presentLoading();
		
		platform.ready().then(() => {

			this.storage.get('introShown').then((result) => {
				
				if(result === true){
					this.rootPage = TabsPage;
				} else {
					this.rootPage = IntroductionPage;
				}
		
				this.loader.dismiss();
		
			  });
			
			// Not that the app has started check for an internet connection so we can access the API
			this.checkInternetConnection();

			statusBar.styleDefault();
			splashScreen.hide();
	  	});
	}

	presentLoading() {

		this.loader = this.loadingCtrl.create({
		  content: "Loading..."
		});
	
		this.loader.present();
	
	  }

    checkInternetConnection(): void {
		
		// watch network for a disconnection
		let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
					
			// No internet connection so inform the user
			let toast = this.toastCtrl.create({
				message: 'Please connect to the internet to use this app.',
				duration: 3000,
				position: 'top'
			});
			
			// Present toast
			toast.present();
		});

		// watch network for a connection
		let connectSubscription = this.network.onConnect().subscribe(() => {
			setTimeout(() => {
				
				if (this.network.type === 'wifi') {
					
					let toast = this.toastCtrl.create({
						message: 'Reconnected to the Internet.',
						duration: 3000,
						position: 'top'
					});
					
					// Present toast
					toast.present();
				}
			}, 3000);
		});
		
	}
}
