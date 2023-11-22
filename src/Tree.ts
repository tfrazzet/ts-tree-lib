import { TreeNode, defaultTraversalStrategy } from "./TreeNode";

/**
 * Represents a generic tree data structure.
 *
 * @template NodeModelType - The type of the node's model.
 * @version 1.0.0
 * @author Tommaso Frazzetto <tommaso.frazzetto@yahoo.com>
 */
export class Tree<NodeModelType> {
  /**
   * The root node of the tree.
   * @type {TreeNode<NodeModelType> | null}
   */
  root: TreeNode<NodeModelType> | null;

  /**
   * The traversal strategy function for the tree.
   * @type {(node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[]}
   * @default defaultTraversalStrategy
   */
  strategy: (node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[] =
    defaultTraversalStrategy;

  /**
   * Creates a new Tree.
   * @param {any} object - The object representing the tree structure.
   * @param {(node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[]} [strategy] - The traversal strategy function.
   */
  constructor(
    object: any,
    strategy?: (node: TreeNode<NodeModelType>) => TreeNode<NodeModelType>[]
  ) {
    // Initialize the root node by parsing the provided object
    this.root = object ? this.parse(object) : null;
    // Set the traversal strategy function, defaulting to depth-first order
    if (strategy) this.strategy = strategy;
  }

  /**
   * Parses a JSON/JavaScript object into a tree.
   * @param {any} object - The object to be parsed.
   * @returns {TreeNode<NodeModelType> | null} - The root node of the parsed tree or null if the object is falsy.
   */
  parse(object: any): TreeNode<NodeModelType> | null {
    if (!object) {
      return null;
    }

    // Create a new root node with the model and index from the object
    const rootNode = new TreeNode(object.model, object.index);
    // Recursively parse the children of the root node
    this.parseChildren(rootNode, object.children);
    return rootNode;
  }

  /**
   * Recursively parses the children of a node.
   * @param {TreeNode<NodeModelType>} parentNode - The parent node.
   * @param {any[]} children - The array of children data.
   */
  private parseChildren(
    parentNode: TreeNode<NodeModelType>,
    children: any[]
  ): void {
    children.forEach((childData, index) => {
      // Create a new child node with the model and index from the child data
      const childNode = new TreeNode(childData.model, index + 1); // Assuming index starts from 1
      // Add the child node to the parent node
      parentNode.addChild(childNode);

      // If the child data has children, recursively parse them
      if (childData.children) {
        this.parseChildren(childNode, childData.children);
      }
    });
  }

  /**
   * Gets all nodes in the tree.
   * @returns {TreeNode<NodeModelType>[] | null} - An array of all nodes in the tree or null if the root is null.
   */
  all(): TreeNode<NodeModelType>[] | null {
    return this.root ? this.strategy(this.root) : null;
  }

  /**
   * Removes a node from the tree.
   * @param {TreeNode<NodeModelType>} node - The node to be removed.
   */
  remove(node: TreeNode<NodeModelType>): void {
    // Helper function to remove a node from an array
    const removeFromArray = (
      arr: TreeNode<NodeModelType>[],
      nodeToRemove: TreeNode<NodeModelType>
    ) => {
      const index = arr.indexOf(nodeToRemove);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    };

    // Helper function to remove a node from the tree
    const removeFromTree = (
      currentNode: TreeNode<NodeModelType>,
      nodeToRemove: TreeNode<NodeModelType>
    ) => {
      // Remove the node from the current node's children
      removeFromArray(currentNode.children, nodeToRemove);

      // Recursively remove the node from the children of the current node
      currentNode.children.forEach((childNode) =>
        removeFromTree(childNode, nodeToRemove)
      );
    };

    // Check if root is not null
    if (this.root) {
      // Check if node is the root
      if (this.root === node) {
        // If removing the root, clear the entire tree
        this.root = null;
      } else {
        // Remove the node from the tree
        removeFromTree(this.root, node);
      }
    }
  }

  /**
   * Finds a node by a predicate function or a property name and value.
   * @param {((node: TreeNode<NodeModelType>) => boolean) | string} predicateOrProperty - The predicate function or property name.
   * @param {any} [value] - The value to compare (if property name is provided).
   * @returns {TreeNode<NodeModelType> | null} - The found node or null if not found.
   */
  find(
    predicateOrProperty: ((node: TreeNode<NodeModelType>) => boolean) | string,
    value?: any
  ): TreeNode<NodeModelType> | null {
    return this.root ? this.root.findChild(predicateOrProperty, value) : null;
  }

  /**
   * Moves a node to a new parent node.
   * @param {TreeNode<NodeModelType>} node - The node to be moved.
   * @param {TreeNode<NodeModelType>} newParent - The new parent node.
   */
  move(
    node: TreeNode<NodeModelType>,
    newParent: TreeNode<NodeModelType>
  ): void {
    // Remove the node from its current parent
    const currentParent = node.getParent(this.root);
    currentParent?.removeChild(node);

    // Add the node to the new parent
    newParent.addChild(node);
  }

  /**
   * Gets the path from the root node to a node.
   * @param {TreeNode<NodeModelType>} node - The target node.
   * @returns {TreeNode<NodeModelType>[] | null} - An array representing the path from the root to the target node or null if the root is null.
   */
  getPath(node: TreeNode<NodeModelType>): TreeNode<NodeModelType>[] | null {
    return this.root ? this.root.getPath(node) : null;
  }

  /**
   * Gets the reverse path from a node to the root node.
   * @param {TreeNode<NodeModelType>} node - The target node.
   * @returns {TreeNode<NodeModelType>[] | null} - An array representing the reverse path from the target node to the root or null if the root is null.
   */
  getReversePath(
    node: TreeNode<NodeModelType>
  ): TreeNode<NodeModelType>[] | null {
    return this.root ? this.root.getReversePath(node) : null;
  }

  /**
   * Walks through the tree and performs a callback function on each node.
   * @param {(node: TreeNode<NodeModelType>) => void} callback - The callback function to be performed on each node.
   */
  walk(callback: (node: TreeNode<NodeModelType>) => void): void {
    // Traverse the tree using the depth-first order strategy and apply the callback to each node
    this.root?.depthFirstSearch(this.root).forEach(callback);
  }

  /**
   * Inserts a new node as a child of the first node that matches a predicate function or a property name and value.
   * @param {TreeNode<NodeModelType>} child - The new child node to be inserted.
   * @param {((node: TreeNode<NodeModelType>) => boolean) | string} predicateOrProperty - The predicate function or property name.
   * @param {any} [value] - The value to compare (if property name is provided).
   */
  insertChild(
    child: TreeNode<NodeModelType>,
    predicateOrProperty: ((node: TreeNode<NodeModelType>) => boolean) | string,
    value?: any
  ): void {
    // Initialize a predicate function
    let predicate: (node: TreeNode<NodeModelType>) => boolean;
    // If the second argument is a function, use it as the predicate function
    if (typeof predicateOrProperty === "function") {
      predicate = predicateOrProperty;
    } else {
      // If the second argument is a string, use it as the property name and compare it with the value
      predicate = (node) =>
        node.model[predicateOrProperty as keyof NodeModelType] === value;
    }
    // Use the strategy function to get the nodes to traverse
    const nodes = this.root ? this.strategy(this.root) : [];
    // Iterate over the nodes
    for (const node of nodes) {
      // If the node matches the predicate function
      if (predicate(node)) {
        // Add the child node to the node
        node.addChild(child);
        return; // Return to indicate success
      }
    }
    // If no node matches the predicate, do nothing
  }
}
