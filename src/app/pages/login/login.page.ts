import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavController, AlertController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
// import { CrudService } from 'src/app/services/bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  logindata: any = {};
  private valinternet = true;
  


  error_messages = {
    'usu': [      
      { type: 'required', message: 'Debe ingresar un usuario'},
      { type: 'minLength', message: 'El usuario debe ser mayor a 5 caracteres'},
      { type: 'maxLength', message: 'El usuario debe ser menos a 10 caracteres'},
      { type: 'pattern', message: 'Ingrese un usuario valido'}
          ],
    'contra': [
      { type: 'required', message: 'Debe ingresar una contraseña' },
      { type: 'minLength', message: 'La contraseña debe ser mayor a 5 caracteres' },
      { type: 'maxLength', message: 'La contraseña debe ser menor a 4 caracteres' },
      { type: 'pattern', message: 'Ingrese una contraseña válida valida' }]
  }
  constructor(
    public storage: Storage,
    private http: HttpClient,
    public navCtrl: NavController,
    // public bd:CrudService,
    public formBuilder: FormBuilder,
    public alertController: AlertController
  ) 
  { 
    // this.bd.databaseConn();
    this.loginForm = this.formBuilder.group({
      usu: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ])), 
      contra: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]*$/)
      ]))
    });
          // //acá me doy cuenta si tiene internet
          // window.addEventListener('offline',()=> {
          //   this.openAlert();
          //   this.valinternet = false;           
          // });
          // window.addEventListener('online',()=> {
          //   this.valinternet = true;           
          // })
  }

  ngOnInit() {
   this.storage.clear();
  //  this.bd.getAllUsers();

  }

  // createUser(){
  //   this.bd.addItem(this.logindata.usu, this.logindata.contra);
  // }

  // ionViewDidEnter() {
  //   this.bd.getAllUsers();
  // }
  // async openAlert (){
  //   const alert = await this.alertController.create({
  //     header: 'Verificar conexión',
  //     message: 'No puedes ingresar, no tiene conexión a internet',
  //     buttons:[{
  //           text: "Aceptar",
  //           handler: ()=>{
  //             this.valinternet = false;
  //               }	
  //           }]
  //       });
  //   await alert.present();
  // }

  async login(){
    this.logindata.usu = this.loginForm.get('usu').value;
    this.logindata.contra = this.loginForm.get('contra').value;
    if (this.logindata.usu != "" && this.logindata.contra != "") {
      //IP ARCHIVOS XAMPP
      let url: string = environment.ApiBakend+"login.php";
      // let url: string = environment.ApiBakend+"login.php";
      const headers = {};
      let dataPost = new FormData();
      dataPost.append('usu', this.logindata.usu);
      dataPost.append('contra', this.logindata.contra);
      let data: Observable<any> = this.http.post(url, dataPost, headers);
      data.subscribe(res => {
        if (res != null) {
          this.storage.set('user', this.logindata.usu);
          this.storage.set('zn', res);
          this.navCtrl.navigateForward(['/tabs']);
          // this.navCtrl.navigateForward(['/encuesta']);
        } else {
          Swal.fire({
            title: 'Error ingreso',
            text:   "Usuario y/o contraseña incorrecta",
            icon: 'error',
            heightAuto: false
          });
        }
      });
      } 
    }
  }
