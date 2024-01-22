class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedList {
  constructor() {
    this.size = 0;
    this.head = null;
  }
  getSize() {
    return this.size;
  }
  isEmpty() {
    return this.size === 0;
  }
  //adding elements to the list
  prepend(val) {
    const node = new Node(val);
    if (this.isEmpty()) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }
  append(val) {
    const node = new Node(val);
    if (this.isEmpty()) {
      this.head = node;
    } else {
      let curr = this.head;
      while (curr.next) {
        curr = curr.next;
      }
      curr.next = node;
    }
    this.size++;
  }
  //removing
  remove() {
    let currPtr = this.head;
    let ptr = null;
    while (currPtr.next) {
      ptr = currPtr;
      currPtr = currPtr.next;
    }
    ptr.next = null;
    this.size--;
  }
  removeIndex(index) {
    if (index === 0) {
      this.head = null;
    } else {
      let prevPtr = this.head;
      let currPtr = this.head;
      for (let i = 0; i < index; i++) {
        prevPtr = currPtr;
        currPtr = currPtr.next;
      }
      prevPtr.next = currPtr.next;
    }
    this.size--;
  }
  print() {
    let curr = this.head;
    const result = [];
    while (curr) {
      // result.push(curr);
      result.push(curr.value);
      curr = curr.next;
    }
    console.log(result);
  }
  //reverse
  reverse() {
    let prev = null;
    let currPtr = this.head;

    while (currPtr) {
      let nextPtr = currPtr.next;
      currPtr.next = prev;
      prev = currPtr;
      currPtr = nextPtr;
    }
    // this.head = prev;
  }
}
const l = new LinkedList();
// l.prepend(1);
// l.prepend(2);
// l.append(100);
// l.append(101);
// l.append(102);
// l.append(103);
// l.append(104);
// l.append(105);
// l.print();
// l.remove();
// l.remove();
// l.remove();
// l.removeIndex(1);
// l.print();

l.append(1);
l.append(2);
l.append(3);
l.print();
l.reverse();
l.print();
