import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { IonDatetime } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserServiceService } from '../../../service/user-service.service';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../../constants/system.const';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
    @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
    @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;
    dateValue: any;
    dateValue1: any;

    roles: any[] = [];

  // managerList: any;
  // salesOfficerList: any;
  reportsTo: any[] =[];

  filterRole = {
    page: 0,
    count: 1000,
    search: '',
    role: '',
    // status: false
  };

    isSubmitted = false;
    public loaderType: string = ngXLoaderType;
    spinner = ngXFgsType;
    userForm: any = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      // psw: ['', [Validators.required, Validators.minLength(6)]],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthDay: [''],

      profile: this.formBuilder.group({
        joinDate: [''],
        roles: ['', [Validators.required]],

      //   profileReportsToId: ['', [Validators.required]],
      // profileReportsToName: ['', [Validators.required]],
      completeAddress: ['', [Validators.required]],
      addressDetails: this.formBuilder.group({
        address1: [''],
        city: [''],
        taluka: [''],
        district: [''],
        state: [''],
        pincode: ['']
      })
    })
  });
name: string;

assignToDisplay = false;
    constructor(
      public platform: Platform,
      public service: UserServiceService,
      private ngxUiLoader: NgxUiLoaderService,
      public toastController: ToastController,
      public formBuilder: UntypedFormBuilder,
      private router: Router,
      public alertController: AlertController,
      private userServiceService: UserServiceService,
      ) {
    }

    ngOnInit() {
      this.getRoleHandler();
    }

    onSelection(event: any) {
      let role = event.detail.value;
      // this.userForm.patchValue({
      //   profile: {
      //     roles: role
      //   }
      // })

      console.log(role);
      if (role === Role.DISTRIBUTOR) {
        console.log('trig');
        this.filterRole.role=Role.SALES_OFFICER;
// this.assignToDisplay = true;
        console.log(role);
        this.getAllRoleUsers();
      } else if (role === Role.SALES_OFFICER) {
        this.filterRole.role=Role.MANAGER;
        this.getAllRoleUsers();
        this.assignToDisplay = true;
      } else {
        this.assignToDisplay = false;
      }
console.log(role);
      this.modifyTemplateByRole(role);


    }

    modifyTemplateByRole(roleOnSelection: any) {
      console.log('tri');
      // if (roleOnSelection === Role.DISTRIBUTOR) {
        if ([Role.MANAGER].includes(roleOnSelection) ) {
          this.userForm.get('profile').addControl('areasCovered',this.formBuilder.control('', [Validators.required]));
          this.userForm.get('profile').removeControl('profileReportsToId');
          this.userForm.get('profile').removeControl('profileReportsToName');
          this.userForm.get('profile').removeControl('companyName');
          this.userForm.get('profile').removeControl('gstin');
          // this.userForm.get('profile').addControl('profileReportsToId',this.formBuilder.control('', [Validators.required]));
          // this.userForm.get('profile').addControl('profileReportsToName',this.formBuilder.control('', [Validators.required]));
          // this.userForm.get('profile').addControl('joinDate',this.formBuilder.control('', [Validators.required]));
        } else if ([Role.SALES_OFFICER].includes(roleOnSelection) ) {
          this.userForm.get('profile').addControl('areasCovered',this.formBuilder.control('', [Validators.required]));
          this.userForm.get('profile').addControl('profileReportsToId',this.formBuilder.control('', [Validators.required]));
          this.userForm.get('profile').addControl('profileReportsToName',this.formBuilder.control('', [Validators.required]));
          this.userForm.get('profile').removeControl('companyName');
          this.userForm.get('profile').removeControl('gstin');
          // this.userForm.get('profile').removeControl('companyName');
          // this.userForm.get('profile').addControl('joinDate',this.formBuilder.control('', [Validators.required]));
        } else if ([Role.DISTRIBUTOR].includes(roleOnSelection)) {
          this.userForm.get('profile').addControl('profileReportsToId',this.formBuilder.control(''));
          this.userForm.get('profile').addControl('profileReportsToName',this.formBuilder.control(''));
          this.userForm.get('profile').addControl('companyName',this.formBuilder.control('', [Validators.required]));
      this.userForm.get('profile').addControl('gstin',this.formBuilder.control(''));
      this.userForm.get('profile').addControl('areasCovered',this.formBuilder.control('', [Validators.required]));

      // this.userForm.get('profile').addControl('location', this.formBuilder.group({longitude: '', latitude: ''}));
      // this.userForm.get('profile').addControl('joinDate',this.formBuilder.control('', [Validators.required]));
    }  else  {
      this.userForm.get('profile').removeControl('profileReportsToId');
      this.userForm.get('profile').removeControl('profileReportsToName');
      this.userForm.get('profile').removeControl('companyName');
      this.userForm.get('profile').removeControl('gstin');
      this.userForm.get('profile').removeControl('areasCovered');
      // this.userForm.get('profile').removeControl('profileReportsToId');
      // this.userForm.get('profile').removeControl('profileReportsToName');
      // this.dateValue = null;
      // this.dateValue1 = null;
      }
    }



  ionViewWillEnter() {
    this.userForm.reset();
  }


    async presentToast(message: string) {
      const toast = await this.toastController.create({
        message,
        duration: 2000
      });
      toast.present();
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    get errorControl() {
      return this.userForm.controls;
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

    formatDate(value: string) {
      const date = format(parseISO(value), 'MMM d, yyyy');
      this.userForm.patchValue({
        profile: {
          joinDate: date
        }
      });
      return date;
    }


    formatDatebirthDay(value: string) {
      const date1 = format(parseISO(value), 'MMM d, yyyy');
      this.userForm.patchValue({
        birthDay: date1
      });
      return date1;
    }

    getRoleHandler( ) {
        this.ngxUiLoader.startLoader('loader-03');
        this.service.getRoles().subscribe(res => {
          this.roles = res.data;
          this.ngxUiLoader.stopLoader('loader-03');
        }, error => {
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        });
    }


    getAllRoleUsers() {
      console.log('triggered');
      // this.ngxUiLoader.startLoader('loader-user-1');
      this.userServiceService.getAllUser(this.filterRole).subscribe(res => {
        // this.ngxUiLoader.stopLoader('loader-user-1');
        console.log(res.data);
        if (res.data) {
          // this.reportsTo = [...this.reportsTo, ...res.data];
console.log(res.data);
this.reportsTo = [];
          for (let i in res.data) {

      // if (i) {
      this.reportsTo[i] = {
            // eslint-disable-next-line no-underscore-dangle
            _id: res.data[i]._id,
            name: res.data[i].userData.firstName +' '+ res.data[i].userData.lastName
          };
        // }
          console.log(i);
         }
        }
        console.log(this.reportsTo);
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error => {
        this.ngxUiLoader.stopLoader('loader-user-1');
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
    }

    itemChange(event: {
      component: IonicSelectableComponent;
      value: any;
    }) {
      console.log(event.value._id);
      console.log(event.value.name);
   this.userForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      profile: {
        profileReportsToId : event.value._id,
        profileReportsToName: event.value.name,
      }

    });
      // eslint-disable-next-line no-underscore-dangle
      // this.getActiveinventorybyProduct(event.value._id);
      // this.showPageDetails = false;
      // this.selectComponent.clear();
      // this.inactive=true;
    }

    submitForm() {
      console.log(this.userForm.value);
      this.isSubmitted = true;
      if (!this.userForm.valid) {
        console.log(MessageLib.FORM_VALIDATION_MESSAGE);
        this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
        return false;
      } else {
        console.log(this.userForm.value);
        // this.ngxUiLoader.startLoader("loader-03");
        this.service.createUserProfile(this.userForm.value).subscribe(res => {
          // this.roles = res.data;
          // this.ngxUiLoader.stopLoader("loader-03");
          this.presentToast(MessageLib.USER_CREATED_SUCCESS);
          this.router.navigate(['/admin/user-management']);
        }, error => {
          // this.ngxUiLoader.stopLoader("loader-03");
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        });

      }
    }



  }
