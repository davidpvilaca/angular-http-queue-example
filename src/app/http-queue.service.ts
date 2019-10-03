import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Queue } from './utils/queue';
import { PendingRequest } from './utils/pending-request';

@Injectable({
  providedIn: 'root'
})
export class HttpQueueService {

  private queue: Queue<PendingRequest<any>> = new Queue();

  invoke<T>(request: Observable<T>): Observable<T> {
    return this.enqueueRequest(request);
  }

  private enqueueRequest<T>(request: Observable<T>): Observable<T> {
    const subject = new Subject<T>();
    const pending = new PendingRequest<T>(request, subject);

    this.queue.enqueue(pending);

    if (this.queue.length === 1) {
      this.startNext();
    }

    return subject.asObservable();
  }

  private startNext(): void {
    if (this.queue.length > 0) {
      this.execute(this.queue.first);
    }
  }

  private execute(pending: PendingRequest<any>): void {
    const req = pending.request.pipe(
      finalize(() => {
        this.startNext();
        req.unsubscribe();
        this.queue.dequeue();
      })
    ).subscribe(
      res => {
        pending.subscription.next(res);
      },
      err => {
        pending.subscription.error(err);
      },
      () => {
        pending.subscription.complete();
      }
    );
  }

}
