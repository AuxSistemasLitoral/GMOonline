import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { InformesRecaudosPageRoutingModule } from './informes-recaudos-routing.module';

import { InformesRecaudosPage } from './informes-recaudos.page';

import { BuscadorRecaudoPipe } from './pipe/buscador-recaudos.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesRecaudosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformesRecaudosPage,BuscadorRecaudoPipe]
})
export class InformesRecaudosPageModule {}
