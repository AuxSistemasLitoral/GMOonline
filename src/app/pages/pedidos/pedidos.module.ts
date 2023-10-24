import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosPage } from './pedidos.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { ExpandableComponent } from '../../components/expandable/expandable.component';

import { PedidosPageRoutingModule } from './pedidos-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: PedidosPage }]),
    PedidosPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [PedidosPage,ExpandableComponent]
})
export class PedidosPageModule {}
