import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';

import { InformesVentasPageRoutingModule } from './informes-ventas-routing.module';

import { InformesVentasPage } from './informes-ventas.page';

import { BuscadorPipe } from './pipe/buscador.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesVentasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformesVentasPage,BuscadorPipe]
})
export class InformesVentasPageModule {}
