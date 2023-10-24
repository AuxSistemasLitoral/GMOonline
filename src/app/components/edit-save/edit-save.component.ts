import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';
import { LoadingController} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Directive, HostListener } from '@angular/core';

@Component({
  selector: 'app-edit-save',
  templateUrl: './edit-save.component.html',
  styleUrls: ['./edit-save.component.scss'],
})
export class EditSaveComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
