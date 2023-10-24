import { Component,OnInit,ViewChild} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PedidosPage } from '../pedidos/pedidos.page';
@Component({
  selector: 'app-informes',
  templateUrl: 'informes.page.html',
  styleUrls: ['informes.page.scss']
})

export class InformesPage {

  cantBotellas: any;

  constructor(private router:Router

  ) {}

   ngOnInit(): void {
    var values = JSON.parse(localStorage.getItem("canBot"));
   }
   
   Ir(route){
    this.router.navigate([route]);
   }
}
