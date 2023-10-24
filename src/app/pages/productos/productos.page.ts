import { IonContent } from '@ionic/angular';
import { Component,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { PedidosService } from '../../services/pedidos.service';
import { AlertController, ActionSheetController, PopoverController, ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { DescuentoComponent } from 'src/app/components/descuento/descuento.component';
import { environment } from 'src/environments/environment';

export interface Productos {
  id: number,
  referecia: string;
  nombre: string;
  factor: number;
  iva: number;
  ico: number;
  ean13: string;
  tipo: number;
  inventario: any;
  lista_precio: any;
  noiva: any;
}

export interface itemDescuentos {
  fec_desde: any,
  fec_hasta: any,
  cant_min: number,
  cant_max: number,
  porc_dcto: number,
  vlr_dcto: number,
  item_obseq: number,
  cant_obseq: number,
  referencia: string,
  nombre_mayor: string,
  nombre: string,
}

@Component({
  selector: 'app-productos',
  templateUrl: 'productos.page.html',
  styleUrls: ['productos.page.scss']
})
export class ProductosPage {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  public Productos: any = [];
  detallesProductos: Productos[];
  isPEP: boolean;
  PEP;
  inicia: number = 0;
  public inpBuscar: any = null;
  public itemDescuentos: any = [];
  detProducto: any = [];
  public loading: boolean;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private pedidosService: PedidosService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public popoverController: PopoverController,
    private modalCtrl: ModalController

  ) {
    this.Productos = [];
  }
  ngOnInit() {
    //this.cargarProductos()
    // this.precarga();
    // this.listarCl();

  }

  ionViewDidEnter() {
    this.precarga();
    this.listarCl();

    // this.detalleProducto(null,null,null,null,null);
  }
  async frmCantidad(producto) {
    const alert = await this.alertController.create({
      header: 'Cantidad',
      cssClass: 'aClass',
      backdropDismiss: false,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          value: producto.cantidad,
          min: 0,
          max: 1000
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: (data) => {
            var pattern = /^\d+$/;
            // console.log(data);
            // console.log(producto);
            if (pattern.test(data.cantidad)) {
              if (data.cantidad <= parseInt(producto.disponible)) {
                producto.cantidad = data.cantidad;
                this.pedidosService.addProducts(producto);
              } else {
                Swal.fire({
                  title: 'Error',
                  text: "Cantidad ingresada supera stock de inventario",
                  icon: 'error',
                  heightAuto: false
                });
              }
            }
            else {
              Swal.fire({
                title: 'Error',
                text: "Cantidad ingresada no es valida",
                icon: 'error',
                heightAuto: false
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }
  OpcionesPedido() {
    this.presentActionSheet();
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {

        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {

        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {

        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {

        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

 expandItem(Productos) {
  this.storage.get('PEP').then((pep) => {
    if (pep !== null) {
      this.detalleProducto(Productos,Productos.id, pep[0].cliente, pep[0].sucursal, pep[0]);
    } else {
      this.detalleProducto(Productos,Productos.id);
    }
  });
    if (Productos.expanded) {
      Productos.expanded = false;
    } else {
       this.Productos.map(listItem => {
        if (Productos == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
          listItem.lista_precio = null;

        }
        return listItem;
      });
    }
  }

  listarCl() {
    this.storage.get('PEP').then((pep) => {
      if (pep !== null) {
        this.cargarProductos(this.inicia, pep[0].lp, null);
      }
    });
  }

  precarga() {
    this.Productos = [];
    this.storage.ready().then(() => {
      this.storage.get('PEP').then((pep) => {
        if (pep != null) {
          this.isPEP = true;
          this.cargarProductos(this.inicia, pep[0].lp, null);
        } else {
          this.isPEP = false;
          this.cargarProductos(this.inicia, null, null);
        }
      });
    });
  }

  btnCancel() {
    this.inpBuscar = "";
    this.Productos = [];
    this.cargarProductos(this.inicia, null, null);
  }
  async mostrarDescuento(producto) {
    const desc = await this.modalCtrl.create({
      component: DescuentoComponent,
      componentProps: {
        producto: producto
      }
    });
    await desc.present();
  }

  BuscarProducto(val) {
    this.inicia = 0;
    this.Productos = [];
    if (val.length > 2) {
      this.storage.get('PEP').then((pep) => {
        if (pep !== null) {
          this.cargarProductos(this.inicia, pep[0].lp,  val);
        } else {
          this.cargarProductos(this.inicia, null, val);
        }
      });
    } else {
      this.listarCl();
    }
  }

  detalleProducto(producto,idProducto,cliente=null,sucursal=null,pep=null) {
    let dataPost = new FormData();
    this.storage.get('user').then((val) => {
      dataPost.append('usu', val);
      dataPost.append('idProducto', idProducto);
      if (cliente != null) {
        dataPost.append('cliente', cliente);
        dataPost.append('sucursal', sucursal);
      }
      let url: string = environment.ApiBakend + "lsProductosID.php";
        let data: Observable<any> = this.http.post(url, dataPost);
        data.subscribe((arr: any[]) => {
          if (arr.length>0) {
            arr.forEach((element, key) => {
              if (typeof element === "object") {
                for (const key1 in element) {
                  if (key1 == 'lista_precio' || key1 == 'inventario') {
                    arr[key][key1] = JSON.parse(arr[key][key1]);
                  }
                }
              } 
            });
            if(pep!=null){
              let listaprecio = arr[0].lista_precio.filter((x)=> x.lista==pep.lp);
              producto.lista_precio=listaprecio;
              producto.disponible=arr[0].Disponible;
              // this.detProducto  = arr[0];
              producto.detProducto  = arr[0];
              // this.detProducto.lista_precio=listaprecio;
            }else{
              // this.detProducto =  arr[0];
              producto.disponible = arr[0].Disponible;
              producto.lista_precio=arr[0].lista_precio;

            }
          } else {
            // this.detProducto  = [];
            delete producto.disponible;
            delete producto.lista_precio;
            // producto.disponible;
            // producto.lista_precio;
          }
    });
  });
}


  cargarProductos(inicia, lp=null, busqueda = null) {
    this.storage.get('user').then((val) => {
      let dataPost = new FormData();
      dataPost.append('usu', val);
      dataPost.append('inicia', inicia);
      if (lp != null) {
        dataPost.append('listaprecio', lp);
        // dataPost.append('sucursal', sucursal);
      }
      if (busqueda != null) {
        dataPost.append('producto', busqueda);
        let url: string = environment.ApiBakend + "lsProductos3.php";
        let data: Observable<any> = this.http.post(url, dataPost);
        data.subscribe((arr: any[]) => {
          if (arr['error'] == undefined) {
            arr.forEach((element, key) => {
              if (typeof element === "object") {
                for (const key1 in element) {
                  if (key1 == 'lista_precio' || key1 == 'inventario') {
                    arr[key][key1] = JSON.parse(arr[key][key1]);
                  }
                }
                let filtro = arr.filter((x)=> x.Disponible>0);
                arr = filtro;
                // console.log(filtro);
                //Garantizar que se conserve cantidad
                this.storage.get('PEP').then((pep) => {
                  if (pep !== null) {
                    for (const key3 in pep[0]["DetallePedido"]) {
                      if (arr[key].id == pep[0]["DetallePedido"][key3].product_id) {
                        arr[key].cantidad = pep[0]["DetallePedido"][key3].cantidad;
                      }
                    }
                  }
                });
              }
            });
            this.Productos = arr;
          } else {
            Swal.fire({
              title: 'Error',
              text: "No hay conexión con la base de datos",
              icon: 'error',
              heightAuto: false
            });
          }
        });
      }else{
        this.Productos = [];
      }
  });
}

ScrollToTop() {
  this.content.scrollToTop(1500);
}

cargarmas(event){
  this.inicia += 30;
  this.Productos = false;
  let val = this.inpBuscar;
  this.storage.get('PEP').then((pep) => {
    if (pep !== null) {
      this.cargarProductos(this.inicia, pep[0].lp, val);
    } else {
      this.cargarProductos(this.inicia, null, val);
    }
    this.loading = false;
  });
  setTimeout(() => {
    event.target.complete();
  }, 2000);
}
mensajes(m) {
  alert(m);
}


ScrollToBottom(){
  this.content.scrollToBottom(1500);
}

ScrollToPoint(X,Y){
  this.content.scrollToPoint(X,Y,1500);
}

}
