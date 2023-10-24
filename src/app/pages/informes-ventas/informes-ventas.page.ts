import { Component,OnInit,ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingController,  ModalController} from '@ionic/angular';
import { DetalleinformevComponent } from 'src/app/components/detalleinformev/detalleinformev.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-informes-ventas',
  templateUrl: './informes-ventas.page.html',
  styleUrls: ['./informes-ventas.page.scss'],
})
export class InformesVentasPage implements OnInit {

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private router: Router,
    public loadingController: LoadingController,
    private modalCtrl: ModalController
  ) {}

   Hoy:string =new Date().toISOString();
   NombreMeses:any=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
   Pedidos:any=[];
   ResumenFacturas:number=0;
   ResumenClientes:number=0;
   Cumplimiento:number=0;
   ResumenAcumulado:number=0;

   public Presupuesto: any=0;
   public Loading : boolean;
   public BuscarInp: string;

  ngOnInit(): void {
      this.Consultarinformes();
      this.presu();
  }

  presu(){
    this.storage.get('zn').then((val) => {
    let year = new Date(this.Hoy).getFullYear();
    let mes = new Date(this.Hoy);
    let currentMonth=('0'+(mes.getMonth()+1)).slice(-2);
    let dataPost = new FormData();
    dataPost.append('cedula', val[0].cedula);
    dataPost.append('periodo', year.toString()+currentMonth.toString());
    let url : string = environment.ApiBakend+"info_cumplimiento.php";
    let data: Observable<any> = this.http.post(url, dataPost);
    data.subscribe((arr: any[]) => {
      if(arr['error']==undefined){
        if(arr.length>0){
          this.Presupuesto = [{
            "Valor":arr[0]['f491_valor']
          }]
        }
      }
      });
    });
  }

  async Consultarinformes(){
    this.presu();
    let loading=await this.loadingController.create({
      message: 'Consultando Registros...'
    });
    await loading.present();
    this.storage.get('zn').then((val) => {
      let mes = new Date(this.Hoy);
      let currentMonth=('0'+(mes.getMonth()+1)).slice(-2);
      let dataPost = new FormData();
      dataPost.append('zona', val[0].cedula);
      dataPost.append('mes', currentMonth.toString());
      let url : string = environment.ApiBakend+"info_venta_enc.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
        this.ResumenFacturas=0;
        this.ResumenClientes=0;
        this.ResumenAcumulado=0;
        let clientes=[];
              if(arr.length!=null){
                    this.Pedidos = arr;
                    this.Pedidos.forEach(element => {
                      clientes.push(element.f201_descripcion_sucursal);
                      this.ResumenAcumulado+=parseFloat(element.NETO);
                      this.ResumenFacturas++;
                      this.Presupuesto['Valor'];
                    });
                    // this.ResumenClientes=this.countUnique(clientes);
                }else{
                 this.mensaje("Error al cargar datos");
               }
              loading.dismiss();
          });
        });
  }

  async irDetalle(document){
    const modal = await this.modalCtrl.create({
      component: DetalleinformevComponent,
      componentProps: { 
        document: document
      }
    });
    await modal.present();
  }
  mensaje(m){
    alert(m);
  } 
  countUnique(iterable) {
    return new Set(iterable).size;
  }
  Buscarinforme( txt: any ){
    this.BuscarInp=txt.toUpperCase();
  }

  btnRegresar() {
    this.router.navigate(['/tabs/informes']);
  }
}