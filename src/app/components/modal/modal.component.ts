import { Component, OnInit } from '@angular/core';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { ProductosPage } from 'src/app/pages/productos/productos.page';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';
import { LoadingController} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputText]'
})

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  
  PEP;
  detallesProductos;
  modalCtrl: any;
  subscription: Subscription;
  observForm: FormGroup;
  observdata: any = {};
  public hab = true;
  
  error_messages = {
    'observaciones': [      
      { type: 'maxLength', message: 'Ingresó más de 200 carácteres'},
      { type: 'pattern', message: 'Carácteres no válidos'}
          ],}

  constructor(
    public alertController: AlertController,
    private pedidosService: PedidosService,
    public router: Router,
    private loadCtrl: LoadingController,
    private navCtrl:NavController,
    public formBuilder: FormBuilder
   
    ){
      this.precarga();
    }
    precarga(){
      this.subscription = this.pedidosService.getPedido().subscribe(PEP=>{
        this.PEP=PEP;
      });
    }
  ngOnInit() {
    this.precarga();
    this.hab = true;
    }
    
  ionViewWillEnter(){
      this.precarga();
  }

    guardarPedido(){
      this.pedidosService.guardarPedido();
      this.pedidosService.dismiss();
    }

  async validarPedido(){
    if(this.PEP['DetallePedido'].length<1){
      let loading=await this.loadCtrl.create({
        spinner: 'dots',
        message: 'El pedido no tiene productos asociados',
        duration: 1000
      });
      await loading.present();
      return false;
    }else{
      return true;
    }
  }

  actObservaciones(obs){
    const pattern = /^[A-Za-z0-9 -%ñ#$,.àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸ´]*$/;
    if(pattern.test(obs)) {
      this.pedidosService.editObservaciones(obs);
    }else{
      this.mensaje('No puedes utilizar caracteres especiales en las observaciones');
    }
  }

  enviarPedido(){
      this.hab = false;
    if(this.validarPedido()){
      const checkenviado=this.pedidosService.enviarPedido();
      if(checkenviado){
        this.mensaje("Pedido enviado");
      }
    }
  }
  
  // handler: async () => {
  //   if(await this.validarPedido()){
  //     const checkenviado = this.pedidosService.enviarPedido();
  //     if(checkenviado){
  //       let loading=await this.loadCtrl.create({
  //         message: 'Enviando Pedido...',
  //         duration: 2000
  //       });
  //       await loading.present();
  //       this.mensaje("Pedido enviado");
  //     }        
  //   }


  async frmCantidad(producto) {
      const alert = await this.alertController.create({
        header: 'Cantidad',
        cssClass: 'aClass',
        backdropDismiss:false,
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
                    if(pattern.test(data.cantidad) && (data.cantidad>=0)) {
                          producto.cantidad=data.cantidad;
                          this.pedidosService.editProducts(producto);
                        }else{
                      this.mensaje('Cantidad ingresada no es valida');
                      }
                    }   
                  }
              ]
           });
      await alert.present();
    }

  btnRegresar(){
      this.pedidosService.dismiss();
  }

  mensaje(m){
      alert(m);
  }  
}
