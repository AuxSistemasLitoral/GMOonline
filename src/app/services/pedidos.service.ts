import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { environment } from 'src/environments/environment';
import {catchError, timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

 //Objeto a enviar a los observadores!
 private subject = new Subject<any>();
 private Pedido = [];
 private subjectlist = new Subject<any>();
 private listaPedidos = [];
 public valinternet = true;

  constructor(
    public storage: Storage,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public router: Router,
    private geo: Geolocation,
    private network: Network,
    public alertController: AlertController
  ) { 
    //acá me doy cuenta si tiene internet
    window.addEventListener('offline',()=> {
      this.openAlert();
      this.valinternet = false;           
    });
    window.addEventListener('online',()=> {
      this.valinternet = true;           
    })
  }

 //acá creo la alerta para saber si tiene internet o no.
  async openAlert (){
    const alert = await this.alertController.create({
      header: 'Verificar conexión',
      message: 'No se puede enviar el pedido, no tiene conexión a internet',
      buttons:[{
            text: "Aceptar",
            handler: ()=>{
              this.valinternet = false;
              // this.router.navigate(['/tabs/productos']);
                }	
            }]
        });
    await alert.present();
    //return false;
  }

  crearPedido(nombre, nit, sucursal, cedula_vendedor, listaprecio, ubicacion) {
    let f = new Date();
    this.Pedido = [{
      "nombresucu": nombre,
      "cliente": nit,
      "lp": listaprecio,
      "sucursal": sucursal,
      "EncabezadoPedido": {
        "Fecha": f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate(),
        "Vendedor_cedula": cedula_vendedor,
        "Latitud": ubicacion[0]['lat'],
        "Longitud": ubicacion[0]['lon']
      },
      "DetallePedido": [],
      "subtotal": 0,
      "subtotalnoiva": 0,
      "observaciones": ""
    }];
    this.subject.next(this.Pedido);
    this.storage.set('PEP', this.Pedido);
  }

  editObservaciones(obs) {
    this.Pedido[0]['observaciones'] = obs;
    this.storage.set('PEP', this.Pedido);
  }
  getPedido(): Observable<any> {
    return this.subject.asObservable();
  }
  
  addProducts(producto) {
    for (const key in this.Pedido[0]['DetallePedido']) {
      if (this.Pedido[0]['DetallePedido'][key].product_id == producto.id) {
        this.Pedido[0]['DetallePedido'].splice(key, 1);
      }
    }
    if (producto.cantidad > 0) {
      this.Pedido[0]['DetallePedido'].push({
        //  encabezado
        "product_id": producto.id,
        "nombre": producto.nombre,
        "referencia": producto.referencia,
        "bodega": producto.bodega,

        //Detalle
        "lista_precio": producto.lista_precio[0].lista,
        "cantidad": producto.cantidad,
        "precio": producto.lista_precio[0].precio,
        "ico": producto.lista_precio[0].ico,
        "iva": producto.lista_precio[0].iva,
        "noiva": producto.lista_precio[0].noiva
      });
    }
    this.subTotal();
    this.subTotalnoiva();
    this.subject.next(this.Pedido);
    this.storage.remove('PEP');
    this.storage.set('PEP', this.Pedido);
  }

  dismiss() {
    this.modalCtrl.dismiss({
      // 'dismissed': true
    });
    this.router.navigate(['/tabs/pedidos']);
  }

  regresarClientes() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
    this.router.navigate(['/tabs/clientes']);
  }

  removeProducts(producto) {
    for (const key in this.Pedido[0]['DetallePedido']) {
      if (this.Pedido[0]['DetallePedido'][key].product_id == producto.id) {
        this.Pedido[0]['DetallePedido'].splice(key, 1);
      }
    }
    this.subTotal();
    this.subTotalnoiva();
    this.subject.next(this.Pedido);
    this.storage.set('PEP', this.Pedido);
  }

  cancelPedido() {
    this.Pedido = [];
    this.subject.next(this.Pedido);
    this.storage.remove('PEP');
    // this.dismiss();
  }
  
  subTotal() {
    let Sub = 0;
    for (const key in this.Pedido[0]['DetallePedido']) {
      Sub += ((this.Pedido[0]['DetallePedido'][key]['precio']) * this.Pedido[0]['DetallePedido'][key]['cantidad']);
    }
    this.Pedido[0]['subtotal'] = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Sub);
  }

  subTotalnoiva() {
    let Sub = 0;
    for (const key in this.Pedido[0]['DetallePedido']) {
      Sub += ((this.Pedido[0]['DetallePedido'][key]['noiva']) * this.Pedido[0]['DetallePedido'][key]['cantidad']);
    }
    this.Pedido[0]['subtotalnoiva'] = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Sub);
  }

  editProducts(producto) {
    //Eliminar si existe
    for (const key in this.Pedido[0]['DetallePedido']) {
      if (this.Pedido[0]['DetallePedido'][key].product_id == producto.product_id) {
        this.Pedido[0]['DetallePedido'].splice(key, 1);
      }
    }
    if (producto.cantidad > 0) {
      this.Pedido[0]['DetallePedido'].push({
        "product_id": producto.product_id,
        "nombre": producto.nombre,
        "referencia": producto.referencia,
        "bodega": producto.bodega,
        "lista_precio": producto.lista_precio,
        "cantidad": producto.cantidad,
        "precio": producto.precio,
        "ico": producto.ico,
        "iva": producto.iva
      });
    }
    this.subTotal();
    this.subTotalnoiva();
    this.storage.remove('PEP');
    this.storage.set('PEP', this.Pedido);
  }

  enviarPedido() {
    if (this.valinternet && navigator.onLine){
          this.geo.getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: true
          }).then((r) => {
            this.Pedido[0].EncabezadoPedido.Latitud = r.coords.latitude;
            this.Pedido[0].EncabezadoPedido.Longitud = r.coords.longitude;
          }
          ).then(() => {
            let url: string = environment.ApiBakend+"envPedido.php";
            const httpOptions = {
              headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
            };
            let data: Observable<any> = this.http.post(url, JSON.stringify(this.Pedido), httpOptions);
            data.pipe(
              timeout(2000),catchError(
                (e:any) =>{
                  this.mensajes("No se pudo enviar la petición, revisa la conexión");
                  // this.guardarPedido();
                  // this.mensajes("Pedido guardado y NO enviado");
                return null
                }
              )
              ).subscribe(res => {
              let mensaje = "";
              let respuesta = JSON.parse(JSON.stringify(res));
              if (respuesta.codigo != null) {
                mensaje += respuesta.error;
                this.mensajes(mensaje);
                if (respuesta.codigo == 1) {
                  for (const key in respuesta.detalle) {
                    if (!respuesta.detalle[key].estado) {
                      mensaje += " Referencia: " + respuesta.detalle[key].referencia;
                      mensaje += " - Cantidad NO Disponible";
                    }
                  }
                } else {
                  mensaje += respuesta.error;
                }
                this.mensajes(mensaje);
                this.Pedido[0]['EncabezadoPedido']['Estado'] = "error";
              } else {
                this.Pedido[0]['EncabezadoPedido']['Estado'] = "enviado";
                this.cancelPedido();
                this.dismiss();
                return true;
              }
            });
          }).catch(e => {
            this.Pedido[0]['EncabezadoPedido']['Estado'] = "error";
            return false;
          });
          //generar envío
        }else{
          this.openAlert();
          return false;
        }
  }

  reenviarPedido(id) {
    this.Pedido[0] = this.listaPedidos[id];
    this.listaPedidos.splice(id, 1);
    this.storage.set('PG', this.listaPedidos);
    this.subjectlist.next(this.listaPedidos);
    this.enviarPedido();
  }

  guardarPedido() {
    //renovar estado del pedido PEP
    if (this.Pedido[0]['EncabezadoPedido']['Estado'] == null) {
      this.Pedido[0]['EncabezadoPedido']['Estado'] = "pendiente";
    }
    //Crear Lista de pedidos guardados/enviados
    let Pedidos_arr = [];
    this.storage.get('PG').then((PG) => {
      if (PG !== null) {
        for (const key in PG) {
          this.listaPedidos.push(PG[key]);
          Pedidos_arr.push(PG[key]);
        }
      }

      //crear subscripcion para pagina de pedidos
      Pedidos_arr.push(this.Pedido[0]);
      this.listaPedidos = Pedidos_arr;
      this.storage.set('PG', Pedidos_arr);
      this.subjectlist.next(this.listaPedidos);

      //remover PEP
      this.storage.remove('PEP');
      this.Pedido = [];
      //renovar susbcripcion
      this.subject.next(this.Pedido);
    });
  }

  getlistaPedidos(): Observable<any> {
    this.storage.ready().then(() => {
      this.storage.get('PG').then((PG) => {
        if (PG !== null) {
          this.listaPedidos = PG;
          this.subjectlist.next(this.listaPedidos);
        } else {
          this.subjectlist.next(this.listaPedidos);
        }
      });
    });
    return this.subjectlist.asObservable();
  }

  editPedido(id) {
    this.Pedido.push(this.listaPedidos[id]);
    this.listaPedidos.splice(id, 1);
    this.storage.set('PG', this.listaPedidos);
    this.storage.set('PEP', this.Pedido);
    this.subject.next(this.Pedido);
    this.subjectlist.next(this.listaPedidos);
  }

  mensajes(m) {
    alert(m);
  }

  enviarNovedad(id, cedula_vendedor, novedad, ubicacion) {
    let Ubicacion=ubicacion;
    this.geo.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true
    }).then((r) => {
      let url: string = environment.ApiBakend+"novedades.php";
      let dataPost = new FormData();
      const headers = {};
      dataPost.append('cliente', id);
      dataPost.append('vendedor', cedula_vendedor);
      dataPost.append('novedad', novedad);
      dataPost.append('lat', r.coords.latitude.toString());
      dataPost.append('lng', r.coords.longitude.toString());
      let data: Observable<any> = this.http.post(url, dataPost, headers);
      data.subscribe((arr: any[]) => {
        if (arr['success'] == undefined) {
          this.mensajes(arr['error']);
        } else {
          this.mensajes(arr['success']);
        }
      });
    }).catch(e => {
      this.mensajes('No fue posible generar la novedad, debido a que no se tiene acceso a la geolocalización');
      this.Pedido[0]['EncabezadoPedido']['Estado'] = "error";
    });
  }
}