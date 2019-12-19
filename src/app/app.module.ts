import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AddBloodSugarPage } from '../pages/add_blood_sugar/add_blood_sugar';
import { RecommendationsPage } from '../pages/recommendations/recommendations';
import { StatisticsPage } from '../pages/statistics/statistics';
import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';
import { RecommendationDetailPage } from '../pages/recommendation-detail/recommendation-detail';
import { TabsPage } from '../pages/tabs/tabs';
import { RecommendedDosePage } from '../pages/recommended-dose/recommended-dose';
import { IntroductionPage } from '../pages/introduction/introduction';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DiabetesDataProvider } from '../providers/diabetes-data/diabetes-data';
import { SettingsProvider } from '../providers/settings/settings';

import { HttpClientModule } from '@angular/common/http';
import { DatetimeFormatProvider } from '../providers/datetime-format/datetime-format';

import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';
import { StatisticsProvider } from '../providers/statistics/statistics';


@NgModule({
  declarations: [
    MyApp,
    AddBloodSugarPage,
    RecommendationsPage,
    RecommendationDetailPage,
    RecommendedDosePage,
    StatisticsPage,
    HistoryPage,
    TabsPage,
    SettingsPage,
    IntroductionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
    ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddBloodSugarPage,
    RecommendedDosePage,
    RecommendationsPage,
    HistoryPage,
    StatisticsPage,
    TabsPage,
    SettingsPage,
    RecommendationDetailPage,
    IntroductionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DiabetesDataProvider,
    DatetimeFormatProvider,
    ,
    Network,
    SettingsProvider,
    IonicStorageModule,
    StatisticsProvider
  ]
})
export class AppModule {}
