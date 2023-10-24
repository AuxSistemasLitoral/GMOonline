import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
// import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
/* import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http'; */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule, 
    // SQLite,
    // SQLiteObject
  ],
  providers: [],
  declarations: [LoginPage]
})
export class LoginPageModule {}
