import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

// import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertController, IonDatetime, PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';

import { Subscription } from 'rxjs';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, Role, TypeOfSale } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, FormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ProfileManagementService } from 'src/app/profile-management/service/profile-management.service';
import { environment } from 'src/environments/environment';
import { PermissionsDataBehaviourSubjectService } from 'src/app/service/permissions-data-behaviour-subject.service';
import { NgxPermissionsService } from 'ngx-permissions';


@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @ViewChild('selectComponentFrom') selectComponentFrom: IonicSelectableComponent;

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.salesOrders;
  combinedPermissionsDataArray: any[] = [];

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;

  showDistributorSelection = true


  modelForm: any = this.formBuilder.group({
    distributorId: ['', [Validators.required]],
    distributorName: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    categoryTypeId: ['', [Validators.required]],
    categoryType: ['', [Validators.required]],
    paymentReceivedDate:  ['', [Validators.required]],
    salesOfficerNote: [''],
    image: this.formBuilder.array([]),
  });



  profiles: any[] = [];
  profile: any;


  mode: 'create' | 'update' = 'create';
  orderId: any;


  public itemsPresent = false;
  private cartSub: Subscription;
  private distributorsSub: Subscription;
  constructor(private router: Router,
    public formBuilder: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private ngxUiLoader: NgxUiLoaderService,
    private toastController: ToastController,
    private profileManagementService: ProfileManagementService,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,
    private ngxPermissionsService: NgxPermissionsService,
  ) {
    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e =>
        res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    });
    this.mode = this.route.snapshot.data.mode || 'create';
    this.orderId = this.route.snapshot.paramMap.get('paymentId');
  }
  ngOnInit() {
    this.modelForm.reset();
  }



  ionViewWillEnter() {

  }


  async categorySelect(event: any) {
    // this.modelForm.patchValue({
    //   orderType: this.orderTypeSelection
    // })
  }

  async getAllAllotedDistributorsDropDown() {
    this.active = false;
    this.profiles = [];
    this.profile = [];
    this.ngxUiLoader.startLoader('loader-orders-list-page');
    this.profileManagementService.getAllDistributorBasedOnAllotmentOfUser().subscribe({
      next: (res) => {
        if (res.data) {
this.profiles = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Alloted Distributors Found!!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list-page');
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list-page');
        // this.distributorDropDowns();
      }
    });
  }

  paymentFromProfileChange(toevent: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.modelForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      orderFromProfileId: toevent.value._id,
      orderFromProfileName: toevent.value.companyName,
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      cssClass: 'my-custom-class',
      translucent: true,
      buttons: ['OK']
    });
    await alert.present();
  }

  async formatDate(value: any) {
    const popover = await this.popoverController.getTop();
    if (popover) {
      popover.dismiss();
    }
    const date = format(parseISO(value), 'MMM d, yyyy');
    this.modelForm.patchValue({
      orderDate: date
    });
    return date;
  }
  
}
