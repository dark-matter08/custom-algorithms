class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class MinHeap {
  constructor() {
    this.root = null;
  }

  // Helper Methods for Node-Based Navigation:

  left(node) {
    return node.left;
  }

  right(node) {
    return node.right;
  }

  parent(node) {
    // Traverses upwards to find the parent of a given node
    if (node === this.root) {
      return null;
    }

    let current = this.root;
    while (current) {
      if (current.left === node || current.right === node) {
        return current;
      }
      current = node.value < current.value ? current.left : current.right;
    }

    return null;
  }

  // Core Heap Operations:

  getMin() {
    // Returns the minimum value (at the root)
    return this.root ? this.root.value : null;
  }

  insert(value) {
    // Inserts a new value into the heap
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(root, node) {
    // Recursively inserts a node into the appropriate position
    if (node.value < root.value) {
      if (root.left === null) {
        root.left = node;
      } else {
        this.insertNode(root.left, node);
      }
    } else {
      if (root.right === null) {
        root.right = node;
      } else {
        this.insertNode(root.right, node);
      }
    }

    this.heapifyUp(node); // Maintain heap property after insertion
  }

  heapifyUp(node) {
    // Rearrange nodes to maintain the heap property upwards from a given node
    let parent = this.parent(node);
    while (node !== null && parent !== null && node.value < parent.value) {
      [node.value, parent.value] = [parent.value, node.value];
      node = parent;
      parent = this.parent(node);
    }
  }

  extractMin() {
    // Removes and returns the minimum value (root)
    if (this.isEmpty()) {
      return null;
    }

    const min = this.root.value;
    if (this.root.left === null) {
      this.root = this.root.right;
    } else if (this.root.right === null) {
      this.root = this.root.left;
    } else {
      const rightmostNode = this.findRightmostNode(this.root.left);
      this.root.value = rightmostNode.value;
      this.removeNode(this.root.left, rightmostNode.value);
    }

    this.MinHeapify(this.root); // Maintain heap property after extraction
    return min;
  }

  decreaseKey(node, new_val) {
    // Decreases the value of a node and maintains the heap property
    node.value = new_val;
    this.heapifyUp(node);
  }

  deleteKey(node) {
    // Deletes a node by decreasing its value to a minimum and extracting it
    this.decreaseKey(node, this.getMin() - 1);
    this.extractMin();
  }

  MinHeapify(node) {
    if (!node) {
      return;
    }

    const left = this.left(node);
    const right = this.right(node);
    let smallest = node;

    if (left && left.value < smallest.value) {
      smallest = left;
    }

    if (right && right.value < smallest.value) {
      smallest = right;
    }

    if (smallest !== node) {
      [node.value, smallest.value] = [smallest.value, node.value]; // Swap values
      this.MinHeapify(smallest); // Recursively heapify the affected subtree
    }
  }
}
