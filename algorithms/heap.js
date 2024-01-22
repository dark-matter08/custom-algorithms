const { Node } = require('./node');

class Heap {
  constructor(type) {
    this.root = null;
    this.type = type ? type : 'MIN';
    this.arr = [];
    this.nodeArr = [];
  }

  parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  parent(node) {
    if (node === this.root) {
      return null; // Root has no parent
    }

    // Traverse upwards to find the parent
    let current = this.root;
    while (current) {
      if (current.left === node || current.right === node) {
        return current;
      }
      current = node.value < current.value ? current.left : current.right;
    }

    return null; // Node not found
  }
  left(i) {
    return 2 * i + 1;
  }
  right(i) {
    return 2 * i + 2;
  }

  isEmpty() {
    return this.root === null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
    this.insertArr(value);
  }

  insertArr(k) {
    let arr = this.arr;
    arr.push(k);

    // Fix the min heap property if it is violated
    let i = arr.length - 1;
    while (i > 0 && arr[this.parentIndex(i)] > arr[i]) {
      let p = this.parentIndex(i);
      [arr[i], arr[p]] = [arr[p], arr[i]];
      i = p;
    }
  }

  insertNode(root, node) {
    if (node.value < root.value) {
      // If the node should go to the left subtree:
      if (root.left === null) {
        root.left = node;
      } else {
        // Recursively insert into the left subtree
        this.insertNode(root.left, node);
      }
    } else {
      // If the node should go to the right subtree:
      if (root.right === null) {
        root.right = node;
      } else {
        // Recursively insert into the right subtree
        this.insertNode(root.right, node);
      }
    }

    // Maintain heap property after insertion (similar to heapifyUp in a heap)
    this.heapifyUp(root);
  }

  heapifyUp(node) {
    let parent = this.parent(node);
    while (node !== null && parent !== null && node.value < parent.value) {
      [node.value, parent.value] = [parent.value, node.value];
      node = parent;
      parent = this.parent(node);
      //   console.log(parent);
    }

    console.log(this.root);
    console.log('==========================');
  }
}

module.exports = { Heap };
