import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaPageRoutingModule } from './encuesta-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { EncuestaPage } from './encuesta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EncuestaPageRoutingModule
  ],
  declarations: [EncuestaPage]
})
export class EncuestaPageModule {}
