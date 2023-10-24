import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from './modal/modal.component';
import { EditSaveComponent } from './edit-save/edit-save.component';
import { CarteraComponent } from './cartera/cartera.component';
import { DetalleinformevComponent } from './detalleinformev/detalleinformev.component';
import { DescuentoComponent } from './descuento/descuento.component';

@NgModule(
        {
        declarations:[
            HeaderComponent,
            FooterComponent,
            ModalComponent,
            EditSaveComponent,
            CarteraComponent,
            DetalleinformevComponent,
            DescuentoComponent
        ],
        exports:[
            HeaderComponent,
            FooterComponent,
            ModalComponent,
            EditSaveComponent,
            CarteraComponent,
            DetalleinformevComponent,
            DescuentoComponent
        ],
        imports:[
                CommonModule
                ]
        }
    )      

    export class ComponentsModule{}