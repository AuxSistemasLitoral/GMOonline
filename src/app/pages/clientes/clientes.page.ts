import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  IonInfiniteScroll,
  IonSearchbar,
  LoadingController,
} from '@ionic/angular';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PedidosService } from '../../services/pedidos.service';
import { CarteraComponent } from 'src/app/components/cartera/cartera.component';
import Swal from 'sweetalert2';
import { Network } from '@ionic-native/network/ngx';
import { environment } from 'src/environments/environment';

export interface ItemBD {
  id: number;
  nit: number;
  sucursal: string;
  nombrecli: string;
  nombresuc: string;
  direccion: string;
  zona: string;
  listaprecio: string;
  condpago: string;
  cupo: number;
  ruta_dia: string;
  cartera: string;
  estado: number;
  telefono: string;
}
export interface Novedades {
  id: number;
  novedad: string;
}
@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss'],
})
export class ClientesPage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public ItemBD: any = [];
  public Hoy = new Date();
  public detalles: ItemBD[];
  public Ubicacion: any = [];
  isPEP: boolean;
  lat;
  lon;
  public OpNovedades: any;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private geo: Geolocation,
    private pedidosService: PedidosService,
    private router: Router,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private network: Network
  ) {
    this.ItemBD = false;
  }
  ngOnInit() {
    this.ItemBD = false;
    // this.cargarDatos(this.BuscarCliente);
    // this.cargarDatos(null,null,null);
    //Habilitar Busqueda inicial con día

    // this.cargarDatos(null,null,this.Hoy.getDay());
    this.listarOpNovedades().subscribe((n) => {
      this.OpNovedades = n;
    });
  }
  ionViewWillEnter() {
    this.ItemBD = false;

    this.storage.get('PEP').then((pep) => {
      if (pep !== null) {
        this.isPEP = true;
        this.cargarDatos(pep[0].cliente, pep[0].sucursal, null);
      } else {
        this.isPEP = false;
        // this.cargarDatos(null,null,null);
        this.cargarDatos(null, null, this.Hoy.getDay());
      }
    });
  }
  cancelBtn() {
    this.cargarDatos(null, null, this.Hoy.getDay());
  }
  async mostrarNovedad(cliente) {
    let Options: any = [];
    this.OpNovedades.forEach((element) => {
      Options.push({
        text: element.novedad,
        handler: () => {
          this.enviarNovedad(cliente, parseInt(element.id));
        },
      });
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Motivo no pedido',
      cssClass: 'actionNovedades',
      buttons: Options,
    });
    await actionSheet.present();
  }
  async mostrarCartera(cliente, nombresuc) {
    const modal = await this.modalCtrl.create({
      component: CarteraComponent,
      componentProps: {
        cliente: cliente,
      },
    });
    await modal.present();
  }
  cancelarPedido() {
    this.pedidosService.cancelPedido();
    this.ionViewWillEnter();
  }
  expandItem(ItemBD): void {
    if (ItemBD.expanded) {
      ItemBD.expanded = false;
    } else {
      this.ItemBD.map((listItem) => {
        if (ItemBD == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }
  BuscarCliente(val) {
    this.ItemBD = false;
    if (val.length > 3) {
      this.cargarDatos(val, null, null);
    } else {
      // this.cargarDatos(null,null,null);
      this.cargarDatos(null, null, this.Hoy.getDay());
    }
  }
  async GenerarPedido(cliente) {
    let loading = await this.loadingController.create({
      message: 'Generando Pedido...',
    });
    await loading.present();
    this.geo
      .getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
      })
      .then((res) => {
        this.lat = res.coords.latitude;
        this.lon = res.coords.longitude;
      })
      .catch((e) => {
        loading.dismiss();
        Swal.fire({
          title: 'Error GPS',
          text: 'No se encontraron datos de GPS, revisar GPS si esta encendido',
          icon: 'error',
          heightAuto: false,
        });
      })
      .then((res) => {
        this.Ubicacion.push({ lat: this.lat, lon: this.lon });
        if (!this.Ubicacion[0].lat) {
          loading.dismiss();
          Swal.fire({
            title: 'Error GPS',
            text: 'No se encontraron datos de GPS, revisar GPS si esta encendido',
            icon: 'error',
            heightAuto: false,
          });
        } else {
          this.storage.get('user').then((cedula_vendedor) => {
            this.pedidosService.crearPedido(
              cliente.nombresuc,
              cliente.nit,
              cliente.sucursal,
              cedula_vendedor,
              cliente.listaprecio,
              this.Ubicacion
            );
            loading.dismiss();
            this.router.navigate(['/tabs/productos']);
          });
          loading.dismiss();
        }
      });
  }
  cargarDatos(cliente = null, sucursal = null, dia = null) {
    this.storage.get('user').then((val) => {
      let dataPost = new FormData();
      dataPost.append('usu', val);
      if (cliente != null) {
        dataPost.append('cliente', cliente);
      }
      if (sucursal != null) {
        dataPost.append('sucursal', sucursal);
      }
      if (dia != null) {
        dataPost.append('dia', dia);
      }
      let url: string = environment.ApiBakend + 'lsClientes.php';
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
        if (arr['error'] == undefined) {
          this.ItemBD = arr;
        } else {
          Swal.fire({
            title: 'Error Cargando datos',
            text: 'No se pudo cargar datos, verificar conexión',
            icon: 'error',
            heightAuto: false,
          });
        }
      });
    });
  }
  async enviarNovedad(cliente, novedad) {
    let loading = await this.loadingController.create({
      message: 'Enviando Novedad...',
    });
    await loading.present();
    this.geo
      .getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
      })
      .then((res) => {
        this.lat = res.coords.latitude;
        this.lon = res.coords.longitude;
      })
      .catch((e) => {
        loading.dismiss();
        Swal.fire({
          title: 'Error GPS',
          text: 'No se encontraron datos de GPS, revisar GPS si esta encendido',
          icon: 'error',
          heightAuto: false,
        });
      })
      .then((res) => {
        this.Ubicacion.push({ lat: this.lat, lon: this.lon });
        if (!this.Ubicacion[0].lat) {
          loading.dismiss();
          Swal.fire({
            title: 'Error GPS',
            text: 'No se encontraron datos de GPS, revisar GPS si esta encendido',
            icon: 'error',
            heightAuto: false,
          });
        } else {
          this.storage.get('user').then((cedula_vendedor) => {
            this.pedidosService.enviarNovedad(
              cliente.id,
              cedula_vendedor,
              novedad,
              this.Ubicacion
            );
            loading.dismiss();
            this.router.navigate(['/tabs/clientes']);
          });
          loading.dismiss();
        }
      });
  }
  listarOpNovedades(): Observable<any> {
    let url: string = environment.ApiBakend + 'opNovedades.php';
    const headers = {};
    return this.http.get(url, headers);
  }
}
