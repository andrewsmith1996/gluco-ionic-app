import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecommendationDetailPage } from './recommendation-detail';

@NgModule({
  declarations: [
    RecommendationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RecommendationDetailPage),
  ],
})
export class RecommendationDetailPageModule {}
