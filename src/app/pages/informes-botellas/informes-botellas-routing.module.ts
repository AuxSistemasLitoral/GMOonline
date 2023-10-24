import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesBotellasPage } from './informes-botellas.page';

const routes: Routes = [
  {
    path: '',
    component: InformesBotellasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesBotellasPageRoutingModule {}
