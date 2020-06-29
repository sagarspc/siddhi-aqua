import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class SharedSubjectService {
  SharingData: Subject<any> = new Subject<any>();
  ModuleOneSub: Subject<any> = new Subject<any>();
  ModuleTwoSub: Subject<any> = new Subject<any>();
  constructor() { }

}