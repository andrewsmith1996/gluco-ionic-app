import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecommendedDosePage } from './recommended-dose';

@NgModule({
  declarations: [
    RecommendedDosePage,
  ],
  imports: [
    IonicPageModule.forChild(RecommendedDosePage),
  ],
})
export class RecommendedDosePageModule {}
