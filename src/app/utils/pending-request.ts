import { Subject, Observable } from 'rxjs';

export class PendingRequest<T> {

  constructor(public readonly request: Observable<T>, public readonly subscription: Subject<any>) { }

}
