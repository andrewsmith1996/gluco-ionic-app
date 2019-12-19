import { Component } from '@angular/core';

import { AddBloodSugarPage } from '../add_blood_sugar/add_blood_sugar';
import { RecommendationsPage } from '../recommendations/recommendations';
import { StatisticsPage } from '../statistics/statistics';
import { HistoryPage } from '../history/history';
import { SettingsPage } from '../settings/settings';
import { DiabetesDataProvider } from '../../providers/diabetes-data/diabetes-data';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddBloodSugarPage;
  tab2Root = HistoryPage;
  tab3Root = StatisticsPage;
  tab4Root = RecommendationsPage;
  tab5Root = SettingsPage;

  recommendation_count: any;

  	constructor(private diabetesData: DiabetesDataProvider) {
		this.updateTabsCount();
  	}

	ionTabsDidChange(){
		this.updateTabsCount();
	}

	updateTabsCount(){
		
		// Get the blood glucose data
		this.diabetesData.get_unseen_recommendations()
		.subscribe(data => { 
		   	this.recommendation_count = Object.keys(data).length;
		}); 
	}
}
