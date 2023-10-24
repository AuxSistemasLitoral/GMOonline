import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cartera',
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.scss'],
})

export class CarteraComponent implements OnInit {
  cliente;
  public Cartera:any;

  constructor( 
    public modalCtrl:ModalController,
    public router: Router,
    private http: HttpClient
    ) { 
    }

  ngOnInit() {
    this.cargarCartera();
  }

  cargarCartera(){
    let dataPost = new FormData();
      if(this.cliente!=null){
        dataPost.append('cliente', this.cliente);
      }
      let url : string = environment.ApiBakend+"cartera.php";
      let data: Observable<any> = this.http.post(url, dataPost);
        data.subscribe((arr: any[]) => {
          if(arr['error']==undefined){
            if(arr.length>0){
              let cupo=0,vencido=0,corriente=0,disponible=0,dias_vencido=arr[0]['dias'];
              let D15=0,D30=0,D45=0,DMAS=0;
              arr.forEach((element:any)=> {
                 if(this.valfac(element['Factura'])){
                  vencido+=parseInt(element['dias'])>0?parseInt(element['saldo']):0;
                  corriente+=parseInt(element['dias'])<=0?parseInt(element['saldo']):0;
                  dias_vencido=parseInt(element['dias'])>dias_vencido?parseInt(element['dias']):dias_vencido;
                  D15+=parseInt(element['dias'])>0 && parseInt(element['dias'])<16?parseInt(element['saldo']):0;
                  D30+=parseInt(element['dias'])>15 && parseInt(element['dias'])<31?parseInt(element['saldo']):0;
                  D45+=parseInt(element['dias'])>30 && parseInt(element['dias'])<46?parseInt(element['saldo']):0;
                  DMAS+=parseInt(element['dias'])>45?parseInt(element['saldo']):0;
                }
              });
              cupo=parseInt(arr[0]['cupo']);
              disponible=cupo-(corriente+vencido);
              this.Cartera = [{
                "ClienteId":arr[0]['id'],
                "ClienteNit":arr[0]['nit'],
                "NombreSuc":arr[0]['nombresuc'],
                "Direccion":arr[0]['direccion'],
                "Cupo":cupo,
                "Disponible":disponible,
                "Corriente":corriente,
                "Vencido":vencido,
                "DiasVencimientos":dias_vencido,
                "D15":D15,
                "D30":D30,
                "D45":D45,
                "DMAS":DMAS,
                "DetalleFacturas":arr
              }];
            }
          }
         });
  }

  btnRegresar() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
    this.router.navigate(['/tabs/clientes']);
  }

  valfac(v:string){
    let fac=['FEV','FET','FES','FSP'];
    let r=false;
    fac.forEach(element => {
      r=element==v.substring(0,3)?true:r;
    });
    return r;
  }

}
