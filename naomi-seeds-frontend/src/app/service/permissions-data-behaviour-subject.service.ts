import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PermissionsDataBehaviourSubjectService {


  private permissionsDataSubject = new BehaviorSubject<any>([]);
  
  constructor() { }

  get permissionsDataObservable() {
    return this.permissionsDataSubject.asObservable();
  }

  updatePermissionsData(permissionsDatapoints: any, userTypeInternalOrExternal: any, userRole: any, userLinkToProfileId: any
    ) {
const newItem: any[] = [];

newItem['permissionsDatapoints'] = permissionsDatapoints;
newItem['userTypeInternalOrExternal'] = userTypeInternalOrExternal;
newItem['userRole'] = userRole;
newItem['userLinkToProfileId'] = userLinkToProfileId;
      return this.permissionsDataSubject.next(newItem);
    }
}
