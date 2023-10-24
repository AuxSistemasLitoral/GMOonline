import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  constructor(
    public storage: Storage,
    private http: HttpClient
  ) { }

    //Objeto a enviar a los observadores!
    private subject = new Subject<any>();
    private Cartera =[];

    getCartera(cliente):Observable<any>{
      let dataPost = new FormData();
      if(cliente!=null){
        dataPost.append('cliente', cliente);
      }
      let url : string = environment.ApiBakend+"cartera.php";
      let data: Observable<any> = this.http.post(url, dataPost);
        data.subscribe((arr: any[]) => {
          if(arr['error']==undefined){
            if(arr.length>0){
              let cupo=0,vencido=0,corriente=0,disponible=0,dias_vencido=arr[0]['dias'];
              arr.forEach((element)=> {
                 vencido+=parseInt(element['dias'])>0?parseInt(element['saldo']):0;
                corriente+=parseInt(element['dias'])<=0?parseInt(element['saldo']):0;
                dias_vencido=parseInt(element['dias'])>dias_vencido?parseInt(element['dias']):dias_vencido;
              });
              cupo=parseInt(arr[0]['cupo']);
              disponible=cupo-(corriente+vencido);
              this.Cartera = [{
                "ClienteId":arr[0]['id'],
                "Cupo":cupo,
                "Disponible":disponible,
                "Corriente":corriente,
                "Vencido":vencido,
                "DiasVencimientos":dias_vencido,
                "DetalleFacturas":arr
              }];
            }
          }
         });
         this.subject.next(this.Cartera);
         return this.subject.asObservable();
    }


}

