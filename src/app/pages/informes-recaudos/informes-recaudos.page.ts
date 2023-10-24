import { Component,OnInit,ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingController,  ModalController} from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-informes-recaudos',
  templateUrl: './informes-recaudos.page.html',
  styleUrls: ['./informes-recaudos.page.scss'],
})
export class InformesRecaudosPage implements OnInit {
  
   Hoy:string =new Date().toISOString();
   NombreMeses:any=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
   Recaudos:any=[];
   ResumenFacturas:number=0;
   ResumenClientes:number=0;
   ResumenAcumulado:number=0;
   public Loading : boolean;
   public BuscarInp: string;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private router: Router,
    public loadingController: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.Consultarinformes();
  }

  async Consultarinformes(){
    let loading=await this.loadingController.create({
      message: 'Consultando Registros...'
    });
    await loading.present();

    this.storage.get('zn').then((val) => {
      let mes = new Date(this.Hoy).getMonth()+1;
      let dataPost = new FormData();
      dataPost.append('zona', val[0].zona);
      dataPost.append('mes', mes.toString());
      let url : string = environment.ApiBakend+"info_recaudo_det.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
        let clientes=[];
        this.ResumenFacturas=0;
        this.ResumenClientes=0;
        this.ResumenAcumulado=0;
           if(arr.length!=null){
                    this.Recaudos = arr;
                    this.Recaudos.forEach(element => {
                      clientes.push(element.IDCLIENTE);
                      this.ResumenAcumulado+=parseFloat(element.f354_valor_cr);
                      this.ResumenFacturas++;
                    });
                    this.ResumenClientes=this.countUnique(clientes);
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
