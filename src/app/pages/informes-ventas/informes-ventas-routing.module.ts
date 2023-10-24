import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesVentasPage } from './informes-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: InformesVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesVentasPageRoutingModule {}
