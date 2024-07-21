import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, Platform, ToastController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { UntypedFormGroup, UntypedFormControl, Validators, FormBuilder} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib } from '../constants/system.const';
import { StorageService } from '../service/service/storage.service';
import { UserServiceService } from '../service/user-service.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isSubmitted = false;
  form: UntypedFormGroup;

  type = true;
  isLogin = false;
  roleAs: string;
  public isLoggedIn: boolean = false;


  // form = this.formBuilder.group({
  //   email: ['', [Validators.required, Validators.email]],
  //   psw: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,30}$')]],
  // });

  // isLoading = false;
  // isLogin = true;

  constructor(


    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public navCtrl: NavController,

    private route: ActivatedRoute,


    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public alertController: AlertController,
    public ionStorage: StorageService,

    ) { }
currentUser: any;

  ngOnInit() {
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email],
      }),
      psw: new UntypedFormControl(null, {
        updateOn: 'blur',
      validators: [Validators.required],
      }),
    });
  }


  changeType() {
    this.type = !this.type;
  }
  // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,30}$')

  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000
  //   }),
  //   toast.present(),
  // }

  // get errorControl() {
  //   return this.form.controls;
  // }


  submitForm() {
    this.isSubmitted = true;
    this.ngxUiLoader.startLoader('loader-login');
    if (!this.form.valid) {
      this.presentAlert(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
 this.authService.login(this.form.value).subscribe((res) => {
    // this.ngxUiLoader.stopLoader('loader-login');
      // localStorage.setItem("token", JSON.stringify(res));


this.storeTokenData(res).then(res => this.authService.getAndStoreUserPermissions());
console.log(this.authService.isLoggedIn)
this.authService.isLoggedIn = true;
console.log(this.authService.isLoggedIn)
        // const user = this.authService.jwtDecoder();
//         const role = user.then(res => 
// {          
//           this.ionStorage.set("STATE", 'true');
//           this.ionStorage.set("ROLE", res.roles[0]);
         
//         })




        this.router.navigateByUrl('/app');
        // if (user?.roles[0] === 'ADMIN') {
        //     this.router.navigateByUrl('/app');};
        // if (user?.roles[0] === 'MANAGER') {
        //   this.router.navigateByUrl('/manager/pending-approvals');};
        // if (user?.roles[0] === 'SALES_OFFICER') {
        //     this.router.navigateByUrl('/sales-officer/pending-approvals');}
        // if (user?.roles[0] === 'DISTRIBUTOR') {
        //   this.router.navigateByUrl('/distributor/pending-approvals');};
        // if (user?.roles[0] === 'ACCOUNTANT') {
        //   this.router.navigateByUrl('/accountant/payments-received');};
        //   if (user?.roles[0] === 'PLANT_MANAGER') {
        //     this.router.navigateByUrl('/plant-manager');};
        // return (
        //   (user?.roles === 'ADMIN' && this.router.parseUrl('/admin')) ||
        //   (user?.roles === 'SALES_OFFICER' && this.router.parseUrl('/sales-officer')) ||
        //   this.router.parseUrl('/auth')
        // );
    // this.router.navigateByUrl('/products');
    // this.presentToast(MessageLib.LOGIN_SUCCESS);
    },
    error => {
      this.ngxUiLoader.stopLoader('loader-login');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.ngxUiLoader.stopLoader('loader-login');
      console.log(error)
      if (error && error.status === 401) {
        this.presentAlert('Unauthorized, please enter valid email and password');
      } else {
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      }
    })
    
    
    ;
  }
 }



   onForgotPassword(): void {

    this.router.navigate(['/login/forgot-password']);
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


 async storeTokenData(res) {
  this.ionStorage.set("token", res.access_token);
  this.ionStorage.set("refreshToken", res.refresh_token);
 }



}













  // authenticate(email: string, password: string) {
  //   this.isLoading = true;
  //   this.loadingCtrl
  //     .create({ keyboardClose: true, message: 'Logging in...' })
  //     .then(loadingEl => {
  //       loadingEl.present();
  //       let authObs: Observable<any>;
  //       if (this.isLogin) {
  //         authObs = this.authService.login(email, password);
  //       }
  //       // else {
  //       //   authObs = this.authService.signup(email, password);
  //       // }
  //       authObs.subscribe(
  //         resData => {
  //           console.log(resData);
  //           this.isLoading = false;
  //           loadingEl.dismiss();
  //           this.router.navigateByUrl('/folder/Dashboard');
  //         },
  //         errRes => {
  //           // loadingEl.dismiss();
  //           // const code = errRes.error.error.message;
  //           // let message = 'Could not sign you up, please try again.';
  //           // if (code === 'EMAIL_EXISTS') {
  //           //   message = 'This email address exists already!';
  //           // } else if (code === 'EMAIL_NOT_FOUND') {
  //           //   message = 'E-Mail address could not be found.';
  //           // } else if (code === 'INVALID_PASSWORD') {
  //           //   message = 'This password is not correct.';
  //           // }
  //           // this.showAlert(message);
  //         }
  //       );
  //     });
  // }



  // onSubmit(form: NgForm) {
  //   if (!form.valid) {
  //     return;
  //   }
  //   const email = form.value.email;
  //   const password = form.value.password;

  //   this.authenticate(email, password);
  //   form.reset();
  //   console.log(email, password);
  // }




  // private showAlert(message: string) {
  //   this.alertCtrl
  //     .create({
  //       header: 'Authentication failed',
  //       message: message,
  //       buttons: ['Okay']
  //     })
  //     .then(alertEl => alertEl.present());
  // }

