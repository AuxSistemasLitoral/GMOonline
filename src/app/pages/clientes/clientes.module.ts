import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesPage } from './clientes.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ClientesPageRoutingModule } from './clientes-routing.module';
import { ExpandableComponent } from '../../components/expandable/expandable.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ClientesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ClientesPage,ExpandableComponent]
})
export class ClientesPageModule {}
