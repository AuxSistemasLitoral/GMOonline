import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-descuento',
  templateUrl: './descuento.component.html',
  styleUrls: ['./descuento.component.scss'],
})
export class DescuentoComponent implements OnInit {
  producto;
  nombrePro;
  public itemDescuentos: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.desc();
  }

  desc(){
    let dataPost = new FormData();

    dataPost.append('id', this.producto);
    let url : string = environment.ApiBakend+"lsDescuento.php";
    let data: Observable<any> = this.http.post(url, dataPost);
    data.subscribe((arr: any[]) => {
              if(arr['error']==undefined){
                if(arr.length>0){
                  this.itemDescuentos = [{
                    "FecDesde":arr[0]['fec_desde'],
                    "FecHasta":arr[0]['fec_hasta'],
                    "CantMin":arr[0]['cant_min'],
                    "CantMax":arr[0]['cant_max'],
                    "PorcDescto":arr[0]['porc_dcto'],
                    "VlrDescto":arr[0]['vlr_dcto'],
                    "idObsequio":arr[0]['item_obseq'],
                    "Obsequio":arr[0]['nombre'],
                    "CantObsequio":arr[0]['cant_obseq'],
                    "TCliente":arr[0]['nombre_mayor'],
                    "id":arr[0]['linea'],
                    "DetalleCant": arr
                    
                  }]
                }
              }
        });
  }

}
