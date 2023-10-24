import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InformesPageRoutingModule } from './informes-routing.module';
import { InformesPage } from './informes.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    InformesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformesPage]
})
export class InformesPageModule {}
