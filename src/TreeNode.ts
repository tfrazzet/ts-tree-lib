/**
 * Represents a node in a generic tree structure.
 *
 * @template NodeModelType - The type of the node's model.
 * @version 1.0.0
 * @author Tommaso Frazzetto <tommaso.frazzetto@yahoo.com>
 */
export class TreeNode<NodeModelType> {
  /**
   * The model associated with the node.
   * @type {NodeModelType}
   */
  model: NodeModelType;

  /**
   * The children nodes of the current node.
   * @type {TreeNode<NodeModelType>[]}
   * @default []
   */
  children: TreeNode<NodeModelType>[] = [];

  /**
   * The index of the node.
   * @type {number}
   */
  index: number;

  /**
   * The traversal strategy function for the node.
   * @type {(node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[]}
   * @default depthFirstSearch
   */
  strategy?: (node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[] =
    this.depthFirstSearch;

  /**
   * Creates a new TreeNode.
   * @param {NodeModelType} model - The model of the node.
   * @param {number} index - The index of the node.
   * @param {(node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[]} [strategy] - The traversal strategy function.
   */
  constructor(
    model: NodeModelType,
    index: number,
    strategy?: (node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[]
  ) {
    this.model = model;
    this.index = index;
    if (strategy) this.strategy = strategy;
  }

  /**
   * Adds a child node to the current node.
   * @param {TreeNode<NodeModelType> | null} child - The child node to be added.
   */
  addChild(child: TreeNode<NodeModelType> | null): void {
    if (child) {
      this.children.push(child);
    }
  }

  /**
   * Removes a child node from the current node.
   * @param {TreeNode<NodeModelType> | null} child - The child node to be removed.
   */
  removeChild(child: TreeNode<NodeModelType> | null): void {
    if (child) {
      this.children = this.children.filter((c) => c !== child);
    }
  }

  /**
   * Moves a child node to a new parent node.
   * @param {TreeNode<NodeModelType> | null} child - The child node to be moved.
   * @param {TreeNode<NodeModelType> | null} newParent - The new parent node.
   */
  moveChild(
    child: TreeNode<NodeModelType> | null,
    newParent: TreeNode<NodeModelType> | null
  ): void {
    if (child && newParent) {
      this.removeChild(child);
      newParent.addChild(child);
    }
  }

  /**
   * Finds a child node by a predicate function or a property name and value.
   * @param {((node: TreeNode<NodeModelType>) => boolean) | string} predicateOrProperty - The predicate function or property name.
   * @param {any} [value] - The value to compare (if the property name is provided).
   * @returns {TreeNode<NodeModelType> | null} - The found child node or null if not found.
   */
  findChild(
    predicateOrProperty: ((node: TreeNode<NodeModelType>) => boolean) | string,
    value?: any
  ): TreeNode<NodeModelType> | null {
    // Initialize a predicate function
    let predicate: (node: TreeNode<NodeModelType>) => boolean;

    // If the first argument is a function, use it as the predicate function
    if (typeof predicateOrProperty === "function") {
      predicate = predicateOrProperty;
    } else {
      // If the first argument is a string, use it as the property name and compare it with the value
      predicate = (node) =>
        node.model[predicateOrProperty as keyof NodeModelType] === value;
    }

    // Iterate through the children to find the matching node
    for (const child of this.children) {
      if (predicate(child)) {
        return child;
      }

      if (child.children) {
        const foundGranChild = child.findChild(predicate);

        if (foundGranChild) {
          return foundGranChild;
        }
      }
    }

    return null;
  }

  /**
   * Gets the path from the current node to a child node.
   * @param {TreeNode<NodeModelType> | null} child - The target child node.
   * @returns {TreeNode<NodeModelType>[] | null} - An array representing the path from the current node to the target child node or null if the current node is null.
   */
  getPath(
    targetNode: TreeNode<NodeModelType>
  ): TreeNode<NodeModelType>[] | null {
    // Initialize the path array
    const path: TreeNode<NodeModelType>[] = [];

    // Helper function to perform the traversal
    const traverse = (currentNode: TreeNode<NodeModelType> | null): boolean => {
      if (!currentNode) {
        return false;
      }

      // Add the current node to the path
      path.push(currentNode);

      // Check if the current node is the target node
      if (currentNode === targetNode) {
        return true;
      }

      // Recursively traverse the children
      for (const child of currentNode.children) {
        if (traverse(child)) {
          return true;
        }
      }

      // If the target node is not found in the subtree, remove the current node from the path
      path.pop();

      return false;
    };

    // Start the traversal from the root
    traverse(this);

    // If the target node is found, return the path; otherwise, return null
    return path.length > 0 ? path : null;
  }

  /**
   * Gets the reverse path from a child node to the current node.
   * @param {TreeNode<NodeModelType> | null} child - The target child node.
   * @returns {TreeNode<NodeModelType>[] | null} - An array representing the reverse path from the target child node to the current node or null if the current node is null.
   */
  getReversePath(
    targetNode: TreeNode<NodeModelType>
  ): TreeNode<NodeModelType>[] | null {
    // Use the getPath method to get the path from the root to the target node
    const path = this.getPath(targetNode);

    // If the path is not found, return null
    if (!path) {
      return null;
    }

    // Reverse the path to get the reverse path
    const reversePath = path.reverse();

    return reversePath;
  }

  /**
   * Gets the parent node of a child node.
   * @param {TreeNode<NodeModelType> | null} child - The target child node.
   * @returns {TreeNode<NodeModelType> | null} - The parent node of the target child node, or null if the child is not found.
   */
  getParent(
    child: TreeNode<NodeModelType> | null
  ): TreeNode<NodeModelType> | null {
    if (!child) {
      // If the child is null, return null (no parent)
      return null;
    }

    // Iterate through the children to find the matching node
    for (const node of this.children) {
      if (node.children.includes(child)) {
        return node;
      }
      const parent = node.getParent(child);
      if (parent) {
        return parent;
      }
    }
    return null;
  }

  /**
   * Finds all child nodes by a predicate function or a property name and value.
   * @param {((node: TreeNode<NodeModelType>) => boolean) | string} predicateOrProperty - The predicate function or property name.
   * @param {any} [value] - The value to compare (if the property name is provided).
   * @returns {TreeNode<NodeModelType>[]} - An array of all child nodes that match the predicate or property name and value.
   */
  findChildren(
    predicateOrProperty: ((node: TreeNode<NodeModelType>) => boolean) | string,
    value?: any
  ): TreeNode<NodeModelType>[] {
    // Initialize a predicate function
    let predicate: (node: TreeNode<NodeModelType>) => boolean;

    // If the first argument is a function, use it as the predicate function
    if (typeof predicateOrProperty === "function") {
      predicate = predicateOrProperty;
    } else {
      // If the first argument is a string, use it as the property name and compare it with the value
      predicate = (node) =>
        node.model[predicateOrProperty as keyof NodeModelType] === value;
    }

    // Filter the children based on the predicate function
    return this.children.filter(predicate);
  }

  /**
   * Deletes all child nodes by a predicate function or a property name and value.
   * @param {((node: TreeNode<NodeModelType>) => boolean) | string} predicateOrProperty - The predicate function or property name.
   * @param {any} [value] - The value to compare (if the property name is provided).
   */
  deleteChildren(
    predicateOrProperty: ((node: TreeNode<NodeModelType>) => boolean) | string,
    value?: any
  ): void {
    // Initialize a predicate function
    let predicate: (node: TreeNode<NodeModelType>) => boolean;

    // If the first argument is a function, use it as the predicate function
    if (typeof predicateOrProperty === "function") {
      predicate = predicateOrProperty;
    } else {
      // If the first argument is a string, use it as the property name and compare it with the value
      predicate = (node) =>
        node.model[predicateOrProperty as keyof NodeModelType] === value;
    }

    // Remove children that match the predicate function
    this.children = this.children.filter((child) => !predicate(child));
  }

  /**
   * Inserts a new node as a child of the first node that matches a predicate function or a property name and value.
   * @param {TreeNode<NodeModelType> | null} child - The new child node to be inserted.
   * @param {((node: TreeNode<NodeModelType>) => boolean) | string} predicateOrProperty - The predicate function or property name.
   * @param {any} [value] - The value to compare (if the property name is provided).
   */
  insertChild(
    child: TreeNode<NodeModelType> | null,
    predicateOrProperty: ((node: TreeNode<NodeModelType>) => boolean) | string,
    value?: any
  ): void {
    if (!child || !this.children) {
      // If the child is null or children array is null/undefined, do nothing
      return;
    }

    const insertIndex =
      typeof predicateOrProperty === "function"
        ? this.children.findIndex(predicateOrProperty)
        : this.children.findIndex(
            (node) =>
              (node.model as Record<string, any>)[predicateOrProperty] === value
          );

    if (insertIndex !== -1) {
      this.children.splice(insertIndex, 0, child);
    } else {
      // If not found, simply append the child
      this.children.push(child);
    }
  }

  /**
   * Performs a depth-first search on the tree starting from the given node,
   * following the specified traversal mode.
   * @param {TreeNode<NodeModelType>} node - The starting node for the depth-first search.
   * @param {"pre-order" | "post-order" | "in-order" | "reverse-pre-order" | "reverse-post-order" | "reverse-in-order"} order - The traversal mode.
   * @returns {TreeNode<NodeModelType>[]} - An array of nodes in the specified traversal order.
   */
  depthFirstSearch(
    node: TreeNode<NodeModelType>,
    order:
      | "pre-order"
      | "post-order"
      | "in-order"
      | "reverse-pre-order"
      | "reverse-post-order"
      | "reverse-in-order" = "in-order"
  ): TreeNode<NodeModelType>[] {
    // Array to store the result of the depth-first search
    const result: TreeNode<NodeModelType>[] = [];

    // Recursive function to traverse the tree in the specified mode
    const traverse = (currentNode: TreeNode<NodeModelType>): void => {
      // Depending on the traversal mode, add the current node to the result array
      if (order.includes("pre-order")) {
        result.push(currentNode);
      }

      // Recursively traverse the children of the current node
      for (const child of currentNode.children) {
        traverse(child);
      }

      // Depending on the traversal mode, add the current node to the result array
      if (order.includes("in-order")) {
        result.push(currentNode);
      } else if (order.includes("post-order")) {
        result.push(currentNode);
      }
    };

    // Start the depth-first search from the specified node
    traverse(node);

    // If the traversal mode is reversed, return the result array in reverse order
    if (
      order === "reverse-pre-order" ||
      order === "reverse-post-order" ||
      order === "reverse-in-order"
    ) {
      return result.reverse();
    }

    // Return the result array
    return result;
  }

  /**
   * Returns the breadth-first order traversal strategy.
   * @param {TreeNode<NodeModelType>} node - The current node.
   * @returns {TreeNode<NodeModelType>[]} - The list of nodes in breadth-first order.
   */
  breadthFirstOrder(node: TreeNode<NodeModelType>): TreeNode<NodeModelType>[] {
    // Initialize the result array with the current node
    let result: TreeNode<NodeModelType>[] = [];
    const queue: TreeNode<NodeModelType>[] = [node];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      // Enqueue the children for further exploration
      queue.push(...current.children);
    }

    return result;
  }
}

/**
 * Default depth-first order traversal strategy.
 * @param {TreeNode<T>} node - The current node.
 * @returns {TreeNode<T>[]} - The list of nodes in depth-first order.
 */
export function defaultTraversalStrategy<T>(node: TreeNode<T>): TreeNode<T>[] {
  return node.depthFirstSearch(node);
}
