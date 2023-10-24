import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  subscription: Subscription;
  cliente: any;
  public validarStorage: boolean;
  constructor(private pedidosService: PedidosService) {
    this.cliente = false;
    this.subscription = this.pedidosService.getPedido().subscribe((pedido) => {
      this.cliente = pedido.length > 0;
    });
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
