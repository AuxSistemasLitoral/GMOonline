import { Component,OnInit,ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingController,  ModalController} from '@ionic/angular';
import { DetalleinformevComponent } from 'src/app/components/detalleinformev/detalleinformev.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-informes-botellas',
  templateUrl: './informes-botellas.page.html',
  styleUrls: ['./informes-botellas.page.scss'],
})
export class InformesBotellasPage implements OnInit {

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private router: Router,
    public loadingController: LoadingController,
    private modalCtrl: ModalController
  ) { }

  Hoy:string =new Date().toISOString();
  NombreMeses:any=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  Botellas:number=0;
  Pedidos:any=[];
  ngOnInit() {
    this.consultarBotellas();
  }


  async consultarBotellas(){

    let loading=await this.loadingController.create({
      message: 'Consultando Registros...'
    });
    await loading.present();
    this.storage.get('zn').then((val) => {
      let mes = new Date(this.Hoy);
      let currentMonth=('0'+(mes.getMonth()+1)).slice(-2);
      let dataPost = new FormData();
      dataPost.append('zona', val[0].zona);
      dataPost.append('mes', currentMonth.toString());
      let url : string = environment.ApiBakend+"lsBotellas.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
        this.Botellas=0;
        let clientes=[];
              if(arr.length!=null){
                    this.Pedidos = arr;
                    this.Pedidos.forEach(element => {
                      // clientes.push(element.f201_descripcion_sucursal);
                      this.Botellas+=parseFloat(element.CANT_750);
                    });
                    // this.ResumenClientes=this.countUnique(clientes);
                }else{
                 this.mensaje("Error al cargar datos");
               }
              loading.dismiss();
          });
        });
  }

  mensaje(m){
    alert(m);
  } 
  btnRegresar() {
    this.router.navigate(['/tabs/informes']);
  }

}

