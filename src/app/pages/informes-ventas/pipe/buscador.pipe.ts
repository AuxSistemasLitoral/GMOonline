import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscador'
})
export class BuscadorPipe implements PipeTransform {

  transform(value: any, x: string): any {
    if(!value || !x){
      return value;
    }

    let filtered =  value.filter((element)=>element.f201_descripcion_sucursal.includes(x) || element.documento.includes(x));
    return filtered;
  }
}
