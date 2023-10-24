import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosPage } from './productos.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { ExpandableComponent } from '../../components/expandable/expandable.component';
import { ComponentsModule } from 'src/app/components/components.module';

import { ProductosPageRoutingModule } from './productos-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ProductosPage }]),
    ProductosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProductosPage,ExpandableComponent]
})
export class ProductosPageModule {}
