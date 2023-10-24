import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuscadorPipe } from './pages/informes-ventas/pipe/buscador.pipe';
import { BuscadorRecaudoPipe } from './pages/informes-recaudos/pipe/buscador-recaudos.pipe';
import { Network} from '@ionic-native/network/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';


@NgModule({
  declarations: [AppComponent, BuscadorPipe, BuscadorRecaudoPipe],
  entryComponents: [AppComponent],
  imports: [BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CodeInputModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    NgxMaskModule.forRoot(),
    IonicStorageModule.forRoot()],
  providers: [
    Geolocation,
    Network,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
