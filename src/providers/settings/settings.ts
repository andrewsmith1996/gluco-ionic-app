import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
Generated class for the SettingsProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class SettingsProvider {

	constructor(public http: HttpClient, private storage: Storage) {

	}

	getICR(){
		return this.storage.get('ICR');
	}

	setICR(ICR){
		this.storage.set('ICR', parseInt(ICR));
	}

	clearStorage(){
		this.storage.clear();
	}
	
}
