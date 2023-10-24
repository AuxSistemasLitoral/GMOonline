import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';

import { InformesPedidosPageRoutingModule } from './informes-pedidos-routing.module';

import { InformesPedidosPage } from './informes-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    InformesPedidosPageRoutingModule
  ],
  declarations: [InformesPedidosPage]
})
export class InformesPedidosPageModule {}
