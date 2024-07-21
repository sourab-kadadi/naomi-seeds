import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../login/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib } from '../../constants/system.const';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private route: ActivatedRoute,


    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }



  goBackToLogin() {
    this.router.navigateByUrl('/login');
  }
}
