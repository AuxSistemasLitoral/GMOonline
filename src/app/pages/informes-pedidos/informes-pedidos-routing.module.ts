import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesPedidosPage } from './informes-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: InformesPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesPedidosPageRoutingModule {}
