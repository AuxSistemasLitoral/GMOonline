import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./pages/informes-ventas/informes-ventas.module').then( m => m.InformesVentasPageModule)
  },
  {
    path: 'recaudos',
    loadChildren: () => import('./pages/informes-recaudos/informes-recaudos.module').then( m => m.InformesRecaudosPageModule)
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./pages/informes-proveedores/informes-proveedores.module').then( m => m.InformesProveedoresPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pages/informes-pedidos/informes-pedidos.module').then( m => m.InformesPedidosPageModule)
  },
  {
    path: 'botellas',
    loadChildren: () => import('./pages/informes-botellas/informes-botellas.module').then( m => m.InformesBotellasPageModule)
  },  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },





];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
