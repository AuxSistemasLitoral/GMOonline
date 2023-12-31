import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ClientesPage } from './clientes.page';

describe('ClientesPage', () => {
  let component: ClientesPage;
  let fixture: ComponentFixture<ClientesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
