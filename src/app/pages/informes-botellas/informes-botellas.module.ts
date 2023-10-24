import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';

import { InformesBotellasPageRoutingModule } from './informes-botellas-routing.module';

import { InformesBotellasPage } from './informes-botellas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesBotellasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformesBotellasPage]
})
export class InformesBotellasPageModule {}
