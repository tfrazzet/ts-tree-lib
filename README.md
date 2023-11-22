# TypeScript Tree Library

![GitHub license](https://img.shields.io/badge/license-GPL--3.0%2B-blue.svg)

# TsTreeLibrary

TsTreeLibrary is a TypeScript library designed to provide a flexible and efficient implementation of tree data structures. It empowers developers to work with hierarchical data in a convenient and intuitive manner.

## Features

**Generic Tree Structure**: TsTreeLibrary supports the creation and manipulation of generic tree structures. This versatility allows you to work with any type of data, making it suitable for a wide range of applications.

**Traversal Strategies**: The library offers different traversal strategies, such as depth-first and breadth-first. This flexibility enables you to choose the most suitable approach for your specific use case, providing efficient ways to traverse and process tree data.

**Node Manipulation** TsTreeLibrary provides a rich set of methods for manipulating nodes within the tree. These include adding and removing nodes, moving nodes to different parents, and finding nodes based on custom criteria. This comprehensive set of functionalities makes it easy to manage and manipulate tree structures according to your application's needs.

## Installation

To install TsTreeLibrary, you can use npm:

```bash
npm install ts-tree-lib
```

## Usage Examples
Here's some basic examples of how to use TsTreeLibrary:

### Creating a Tree
```typescript
import { Tree, TreeNode, defaultTraversalStrategy } from 'ts-tree-lib';

// Define your data model
type MyNodeModel = {
  id: number;
  name: string;
  data: Record<string, any>;
};

// Create a sample tree structure
const treeData = {
  model: { id: 1, name: 'root', data: { value: 10 } },
  children: [
    { model: { id: 2, name: 'child1', data: { value: 20 } }, children: [] },
    { model: { id: 3, name: 'child2', data: { value: 30} }, children: [
        { model: { id: 4, name: 'child3', data: { value: 40 } }, children: [] },
        { model: { id: 5, name: 'child4', data: { value: 50 } }, children: [
            { model: { id: 6, name: 'child5', data: { value: 60 } }, children: [] },
            { model: { id: 7, name: 'child6', data: { value: 70 } }, children: [] },
        ] },
    ] },
  ],
};

// Create a new Tree instance
const tree = new Tree<MyNodeModel>(treeData);

// Log tree structure
console.log("Tree :>> ", tree);
```

### Traversing the Tree

```typescript
// Access the root node
const root = tree.root;

// Get all nodes using the default depth-first traversal strategy
const nodes = tree.all();
console.log(nodes);

// Use a different traversal strategy, e.g., breadth-first
const nodesBFS = tree.strategy = tree.breadthFirstOrder;
const bfsResult = nodesBFS(root);
console.log(bfsResult);
```
### Adding Children
```typescript
// Add a new child to a specific node
const parentNode = /* your parent node */;
const newChild = new TreeNode(/* your new child data */);
parentNode.addChild(newChild);

// Insert a new child based on a predicate or property
const newNode = new TreeNode(/* your new node data */);
tree.insertChild(newNode, 'parentId', 'example');
```

### Removing Children
```typescript
// Remove a child from a specific node
const parentNode = /* your parent node */;
const childToRemove = /* your child node */;
parentNode.removeChild(childToRemove);

// Remove a node from the tree
const nodeToRemove = /* your node */;
tree.remove(nodeToRemove);
```

### Inserting a New Child Node
```typescript
// Insert a new child node based on a predicate or property
const newNode = new TreeNode(/* your new node data */);
tree.insertChild(newNode, 'parentId', 'example');
```

### Moving a Node
```typescript
// Move a node to a new parent
const nodeToMove = /* your node */;
const newParent = /* new parent node */;
tree.move(nodeToMove, newParent);
```

### Finding a Node
```typescript
// Find a node using a predicate function
const foundNode = tree.find((node) => node.model.name === 'example');
```

### Walking Through the Tree
```typescript
// Walk through the tree and perform a callback function on each node
tree.walk((node) => {
  console.log(`Visited node: ${node.model.name}`);
});
```

### Changing the traversal strategy
There are two predefined traversal strategies: depthFirstSearch (the default strategy) or breadthFirstOrder.
Here is an example of how you can use the breadthFirstOrder traversal strategy instead of the default depthFirstSearch.

```typescript
/import { Tree, TreeNode, defaultTraversalStrategy } from './path/to/your/tree/library';

// Assume you have your NodeModelType defined

// Create a sample tree structure
const treeData = {
  model: { id: 1, name: 'root', data: {} },
  children: [
    {
      model: { id: 2, name: 'child1', data: {} },
      children: [
        { model: { id: 4, name: 'child1.1', data: {} }, children: [] },
        { model: { id: 5, name: 'child1.2', data: {} }, children: [] },
      ],
    },
    {
      model: { id: 3, name: 'child2', data: {} },
      children: [],
    },
  ],
};

// Create a new Tree instance
const tree = new Tree(treeData);

// Use breadthFirstOrder for traversal
const nodesInBreadthFirstOrder = tree.root ? tree.root.breadthFirstOrder(tree.root) : [];

// Log the result
console.log(nodesInBreadthFirstOrder.map(node => node.model.name));
```

### Changing Depth-First Search Order
```typescript
// Change the depth-first search order for a specific node
const customOrder = ["pre-order", "reverse-post-order"];
const nodesWithCustomOrder = root?.depthFirstSearch(root, customOrder);
console.log(nodesWithCustomOrder);

```


### Documentation
For more details and advanced usage, refer to the API documentation.
To build documentation run the following command in the terminal:

```bash
npm run docs
```
Documentation is created in **docs** folder.

### Testing with Jest

To ensure the reliability and correctness of TsTreeLibrary, we use Jest, a popular JavaScript testing framework. Follow these steps to run the tests:

1. **Install Dependencies:**
Ensure you have Node.js and npm installed. Navigate to the project root directory in your terminal and run the following command to install dependencies:

```bash
npm install
```

2. **Run Tests:**
Execute the following command to run the Jest test suite:
```bash
npm run test
```
Jest will run the test cases and provide feedback on the success or failure of each test. Make sure that all tests pass before making modifications or contributions to the library.

3. **Write Additional Tests:**
If you are extending the library or making significant changes, consider adding new test cases to cover the added functionality. Tests help maintain the stability of the library across updates and improvements.

By following these testing guidelines, you contribute to the robustness of TsTreeLibrary and ensure that it meets the expected standards.


### License
TsTreeLibrary is licensed under the GNU General Public License v3.0 (GPL-3.0). See the **LICENSE.md** file for details.