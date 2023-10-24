import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { InformesProveedoresPageRoutingModule } from './informes-proveedores-routing.module';

import { InformesProveedoresPage } from './informes-proveedores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesProveedoresPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformesProveedoresPage]
})
export class InformesProveedoresPageModule {}
