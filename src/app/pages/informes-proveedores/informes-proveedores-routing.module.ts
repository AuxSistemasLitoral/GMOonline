import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesProveedoresPage } from './informes-proveedores.page';

const routes: Routes = [
  {
    path: '',
    component: InformesProveedoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesProveedoresPageRoutingModule {}
