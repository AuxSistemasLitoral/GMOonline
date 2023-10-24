import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscadorRecaudo'
})
export class BuscadorRecaudoPipe implements PipeTransform {

  transform(value: any, x: string): any {
    if(!value || !x){
      return value;
    }

    let filtered =  value.filter((element)=>element.IDCLIENTE.includes(x) || element.DOC_FAC.includes(x) || element.DOC_PAGO.includes(x) || element.CLIENTE.includes(x));
    return filtered;
  }
}
