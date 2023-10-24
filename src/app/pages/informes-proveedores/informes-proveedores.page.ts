import { Component,OnInit,ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingController,  ModalController} from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-informes-proveedores',
  templateUrl: './informes-proveedores.page.html',
  styleUrls: ['./informes-proveedores.page.scss'],
})
export class InformesProveedoresPage implements OnInit {

   Hoy:string =new Date().toISOString();
   proveedores:any=null;
   proveedorSelect:any=null;
   NombreMeses:any=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
   productos:any=[];
   ResumenProductos:number=0;
   ResumenVendido:number=0;
   public Loading : boolean;
   public BuscarInp: string;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private router: Router,
    public loadingController: LoadingController,
    private modalCtrl: ModalController
  ) {
  }

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
      if(this.proveedorSelect!=null)
        dataPost.append('proveedor',this.proveedorSelect);
      let url : string = environment.ApiBakend+"info_proveedores.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
        //variable para eliminar repetidos
        this.ResumenProductos=0;
        this.ResumenVendido=0;
        let ObjPro=[];
          if(arr.length!=null){
               this.productos = arr;
               this.productos.forEach(element => {
                 this.ResumenProductos+=parseFloat(element.CANT);
                 this.ResumenVendido+=parseFloat(element.NETO);
                 if(this.proveedores==null){
                    ObjPro.push(
                      {
                        "idProveedor": element.idProveedor,
                        "Proveedor": element.Proveedor
                      }
                    );
                  }
               });
               if(this.proveedores==null){
                this.proveedores = ObjPro.filter((valorActual, indiceActual, arreglo) => {
                  return arreglo.findIndex(
                    valorDelArreglo =>JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)
                    ) === indiceActual
                });     
               }
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

    btnRegresar() {
      this.router.navigate(['/tabs/informes']);
    }

}

