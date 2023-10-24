import { Component } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Storage } from '@ionic/storage';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditSaveComponent } from 'src/app/components/edit-save/edit-save.component';
import { Observable } from 'rxjs';
import { ClientesPage } from '../clientes/clientes.page';
import Swal from 'sweetalert2';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedidos',
  templateUrl: 'pedidos.page.html',
  styleUrls: ['pedidos.page.scss']
})
export class PedidosPage {
  public Pedidos: any = [];
  public Loading: boolean;
  subscription: Subscription;
  PG: any;
  PEP: any;
  PedidosEnviados: any;
  CantidadPedidosDia: any;
  CantidadBotellas: any;
  CantBotellas: any;
  SumaPedidoDia: any;
  Sumanoiva: any;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public navCtrl: NavController,
    public loadingController: LoadingController,
    private pedidosService: PedidosService,
    public router: Router,
    private modalCtrl: ModalController
  ) {
    this.CantidadPedidosDia = 0;
    this.SumaPedidoDia = 0;
    this.Sumanoiva= 0;
    this.PG = false;
    this.PedidosEnviados = false;
    this.CantidadBotellas = false;
    this.CantBotellas = 0;
    this.subscription = this.pedidosService.getlistaPedidos().subscribe(lista => {
      this.PG = lista;
    });
  }
  ionViewWillEnter() {
    this.cargarDatos();
    this.cantBotellas();

    if (Object.keys(this.PG).length <= 0) {
      this.PG = false;
    }
    if (Object.keys(this.PedidosEnviados).length <= 0) {
      this.PedidosEnviados = false;
    }
    this.Loading = true;
    setTimeout(() => this.Loading = false, 1000);
  }
  nuevoPedido() {
    this.router.navigate(['/tabs/clientes']);
  }
  reenviarPedido(id) {
    this.pedidosService.reenviarPedido(id);
  }
  editarPedido(id) {
    this.pedidosService.editPedido(id);
    this.router.navigate(['/tabs/productos']);
  }
  expandItem(pedido): void {
    if (pedido.expanded) {
      pedido.expanded = false;
    } else {
      this.PedidosEnviados.map(listItem => {
        if (pedido == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }
  cargarDatos() {
    this.CantidadPedidosDia = 0;
    this.SumaPedidoDia = 0;
    this.Sumanoiva = 0;
    this.storage.get('user').then((val) => {
      let dataPost = new FormData();
      dataPost.append('usu', val);
      let url: string = environment.ApiBakend+"pedidosEnviados.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => { 
        if (arr['error'] == undefined) {
          this.PedidosEnviados = arr;
          this.PedidosEnviados = JSON.parse(JSON.stringify(arr));
          this.CantidadPedidosDia = this.PedidosEnviados.length;
          if (Object.keys(this.PedidosEnviados).length <= 0) {
            this.PedidosEnviados = false;
          } else {
            this.PedidosEnviados.forEach(element => {
              this.SumaPedidoDia += parseFloat(element.subtotal);
              this.Sumanoiva += parseFloat(element.subtotalnoiva);
            });
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: "Error al cargar datos",
            icon: 'error',
            heightAuto: false
          });
        }
      });
    });
  }
  CancelarPedido(pedido) {
    let dataPost = new FormData();
    dataPost.append('id', pedido.id);
    let url: string = environment.ApiBakend+"CancelarPedido.php";
    let data: Observable<any> = this.http.post(url, dataPost);
    data.subscribe((arr: any[]) => {
      if (arr['success'] == undefined) {  
        alert(arr['error']);
      } else {
        alert(arr['success']);
        // this.navCtrl.pop(); 
        this.router.navigate(['/tabs/clientes']);
      }
    });
  }

  cantBotellas(){
    this.CantBotellas = 0;
    this.storage.get('user').then((val) => {
      let dataPost = new FormData();
      dataPost.append('usu', val);
      let url: string = environment.ApiBakend+"CantBotellas.php";
      let data: Observable<any> = this.http.post(url, dataPost);
      data.subscribe((arr: any[]) => {
        if (arr['error'] == undefined) {
          this.CantidadBotellas = arr;
          this.CantidadBotellas = JSON.parse(JSON.stringify(arr));
            this.CantidadBotellas.forEach(element => {
              this.CantBotellas += parseFloat(element.Total);
              localStorage.setItem('canBot', this.CantBotellas);
            });
          }
        }) 
    });
  }


}
