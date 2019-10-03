export class Queue<T> {
  private store: T[] = [];
  enqueue(val: T): void {
    this.store.push(val);
  }
  dequeue(): T | undefined {
    return this.store.shift();
  }

  get first(): T | undefined {
    return this.length > 0 ? this.store[0] : undefined;
  }

  get length(): number {
    return this.store.length;
  }
}
