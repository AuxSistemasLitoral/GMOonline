import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy{

  subscription: Subscription;
  PEP:any;
   public validarStorage: boolean;
   constructor(
     private pedidosService: PedidosService,
     public storage: Storage,
     private loadCtrl: LoadingController,
     private router: Router,
     public actionSheetController: ActionSheetController,
     private modalCtrl: ModalController
     ) {
    this.PEP=false;
     this.subscription = this.pedidosService.getPedido().subscribe(pedido=>{
       this.PEP=pedido[0];
     });
   }
 
   ngOnInit() {
   }
   ngOnDestroy(){
     this.subscription.unsubscribe();
   }


  async mostrarModal(){
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: { 
        PEP: this.PEP
      }
      
    });
    await modal.present();
 }

   async presentActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Pedido',
      buttons: [{
        text: 'Ver',
        icon: 'eye',
        handler: async() => {
          if(await this.validarPedido()){
            this.mostrarModal();
            }
        }
      }, {
        text: 'Enviar',
        icon: 'send',
        handler: async () => {
          if(await this.validarPedido()){
            const checkenviado = this.pedidosService.enviarPedido();
            if(checkenviado){
              let loading=await this.loadCtrl.create({
                message: 'Enviando Pedido...',
                duration: 2000
              });
              await loading.present();
              this.mensaje("Pedido enviado");
            }        
          }
        }
      }, {
        text: 'Guardar',
        icon: 'save',
        handler: async() => {
          if(await this.validarPedido()){
            this.pedidosService.guardarPedido();
            let loading=await this.loadCtrl.create({
              message: 'Guardando Pedido...',
              duration: 2000
            });
            await loading.present();
            this.router.navigate(['/tabs/pedidos']);
          }  
        }
      },{
          text: 'Cancelar Pedido',
          icon: 'close',
          handler: () => {
            this.pedidosService.cancelPedido();
            this.PEP = false;
            this.router.navigate(['/tabs/clientes']);
          }
      }]
    });
    await actionSheet.present();
  }

  mensaje(m){
    alert(m);
  }  
  OpcionesPedido(){
    this.presentActionSheet();
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
}
