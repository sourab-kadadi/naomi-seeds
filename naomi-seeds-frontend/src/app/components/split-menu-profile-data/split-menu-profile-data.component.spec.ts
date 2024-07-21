import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplitMenuProfileDataComponent } from './split-menu-profile-data.component';

describe('SplitMenuProfileDataComponent', () => {
  let component: SplitMenuProfileDataComponent;
  let fixture: ComponentFixture<SplitMenuProfileDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitMenuProfileDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SplitMenuProfileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
