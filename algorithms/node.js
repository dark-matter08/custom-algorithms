class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  leftIndex(i) {
    return 2 * i + 1;
  }
  rightIndex(i) {
    return 2 * i + 1;
  }

  insertChildren(node, root = this) {
    if (node.value < root.value) {
      if (root.left === null) {
        root.left = node;
      } else {
        this.insertChildren(root.left, node);
      }
    } else {
      if (root.right === null) {
        root.right = node;
      } else {
        this.insertChildren(root.right, node);
      }
    }
  }
}

module.exports = { Node };
