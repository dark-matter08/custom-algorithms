const { Node } = require('./node');

class BinarySearchTree {
  constructor() {
    this.root = null;
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
  }

  insertNode(root, node) {
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
  }

  search(value, root = this.root) {
    if (!root) {
      return false;
    } else {
      if (root.value === value) {
        return true;
      } else if (value < this.root.value) {
        this.search(value, root.left);
      } else {
        this.search(value, root.right);
      }
    }
  }

  //   Depth first traversal -  1
  preOrder(root = this.root) {
    if (root) {
      console.log(root.value);
      this.preOrder(root.left);
      this.preOrder(root.right);
    }
  }

  //   Depth first traversal -  2
  inOrder(root = this.root) {
    if (root) {
      this.inOrder(root.left);
      console.log(root.value);
      this.inOrder(root.right);
    }
  }

  //   Depth first traversal -  3
  postOrder(root = this.root) {
    if (root) {
      this.inOrder(root.left);
      this.inOrder(root.right);
      console.log(root.value);
    }
  }

  //   Breadth first traversal
  levelOrder() {
    // use a more optimized queue
    const queue = [];
    queue.push(this.root);
    while (queue.length) {
      let curr = queue.shift();
      console.log(curr.value);
      if (curr.left) {
        queue.push(curr.left);
      }
      if (curr.right) {
        queue.push(curr.right);
      }
    }
  }

  min(root = this.root) {
    if (!root.left) {
      return root.value;
    } else {
      return this.min(root.left);
    }
  }

  max(root = this.root) {
    if (!root.right) {
      return root.value;
    } else {
      return this.max(root.right);
    }
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(root, value) {
    if (root === null) {
      root;
    }

    if (value < root.value) {
      root.left = this.deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = this.deleteNode(root.right, value);
    } else {
      if (!root.left && !root.right) {
        return null;
      }

      if (!root.left) {
        return root.right;
      } else if (!root.right) {
        return root.left;
      }

      root.value = this.min(root.right);
      root.right = this.deleteNode(root.right, value);
    }

    return root;
  }
}

module.exports = { BinarySearchTree };
