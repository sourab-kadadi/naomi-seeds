import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoleAndPermissionManagementPage } from './role-and-permission-management.page';

describe('RoleAndPermissionManagementPage', () => {
  let component: RoleAndPermissionManagementPage;
  let fixture: ComponentFixture<RoleAndPermissionManagementPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleAndPermissionManagementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAndPermissionManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
