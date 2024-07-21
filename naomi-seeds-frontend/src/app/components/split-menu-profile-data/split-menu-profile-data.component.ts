import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from 'src/app/service/service/storage.service';
import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'app-split-menu-profile-data',
  templateUrl: './split-menu-profile-data.component.html',
  styleUrls: ['./split-menu-profile-data.component.scss'],
})
export class SplitMenuProfileDataComponent implements OnInit {
tokenData: any;
  // @Input() item: any;
  // @Output() data: EventEmitter<any> = new EventEmitter();
  firstName: any;
  lastName: any;
  role: any;


  constructor( public ionStorage: StorageService,
    private auth: AuthService
    ) {
    this.ionStorage.getTokenData().then(res =>{ 
      this.firstName = this.capitalize(res.firstName);
      this.lastName = this.capitalize(res.lastName);
      this.role = this.capitalize(res.roles[0]);
    });

  }

  ngOnInit() {
    // this.getProfileData();
  }


   capitalize(s) {
     s = s.toLowerCase();
     return s[0].toUpperCase() + s.slice(1);
   }



   async getTokenData() {
    const helper = new JwtHelperService();
    const token = this.ionStorage.get('token').then(res => helper.decodeToken(res));
    const user = token.then(result => {
      if (result) {
        this.tokenData = result;
        // this.getUserById();
      } else {
        return;
      }
    });
  }


}
