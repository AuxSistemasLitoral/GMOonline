import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesRecaudosPage } from './informes-recaudos.page';

const routes: Routes = [
  {
    path: '',
    component: InformesRecaudosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesRecaudosPageRoutingModule {}
