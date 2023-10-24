import { Component, OnInit } from '@angular/core';
import { ModalController,LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalleinformev',
  templateUrl: './detalleinformev.component.html',
  styleUrls: ['./detalleinformev.component.scss'],
})
export class DetalleinformevComponent implements OnInit {

  constructor( 
    public modalCtrl:ModalController,
    public router: Router,
    private http: HttpClient,
    public loadingController: LoadingController,
    private navCtrl: NavController
    ) { 
    }
  document;
  detPedidos:any;
  ngOnInit() {
    this.Consultarinformes();
  }
  async Consultarinformes(){

    let loading=await this.loadingController.create({
      message: 'Consultando Registro...'
    });
    await loading.present();

      let dataPost = new FormData();
      dataPost.append('tipo_doc', this.document.documento.split('_')[0]);
      dataPost.append('num_doc', this.document.documento.split('_')[1]);
      let url : string = environment.ApiBakend+"info_venta_det.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
               if(arr.length>0){
                    this.detPedidos = arr;
                    console.log(arr);
              }else{
                 this.mensaje("Error al cargar datos");
              }
              loading.dismiss();
          });
    }
    btnRegresar() {
      this.modalCtrl.dismiss({
        'dismissed': true
      });
    }
    mensaje(m){
      alert(m);
    } 

}
