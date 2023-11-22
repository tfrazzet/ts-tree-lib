import { TreeNode, defaultTraversalStrategy } from "../src/TreeNode";

describe("TreeNode", () => {
  let rootNode: TreeNode<any>;

  beforeEach(() => {
    // Create a sample tree for testing
    rootNode = new TreeNode(
      { id: 0, name: "root", data: { value: 10 } },
      0,
      defaultTraversalStrategy
    );

    const child1 = new TreeNode(
      { id: 1, name: "child1", data: { value: 20 } },
      1,
      defaultTraversalStrategy
    );

    const child2 = new TreeNode(
      { id: 2, name: "child2", data: { value: 30 } },
      2,
      defaultTraversalStrategy
    );

    rootNode.addChild(child1);
    rootNode.addChild(child2);

    const grandchild1 = new TreeNode(
      { id: 3, name: "grandchild1", data: { value: 40 } },
      3,
      defaultTraversalStrategy
    );

    child1.addChild(grandchild1);
  });

  test("addChild should add a child node", () => {
    const newChild = new TreeNode(
      { id: 4, name: "newChild", data: { value: 50 } },
      4,
      defaultTraversalStrategy
    );

    rootNode.addChild(newChild);
    expect(rootNode.children).toContain(newChild);
  });

  test("removeChild should remove a child node", () => {
    const childToRemove = rootNode.children[0];
    rootNode.removeChild(childToRemove);
    expect(rootNode.children).not.toContain(childToRemove);
  });

  test("moveChild should move a child to a new parent", () => {
    const newParent = new TreeNode(
      { id: 5, name: "newParent", data: { value: 60 } },
      5,
      defaultTraversalStrategy
    );

    const childToMove = rootNode.children[0];

    rootNode.moveChild(childToMove, newParent);

    expect(rootNode.children).not.toContain(childToMove);
    expect(newParent.children).toContain(childToMove);
  });

  test("findChild should find a child node", () => {
    const foundChild = rootNode.findChild(
      (node) => node.model && node.model.name === "grandchild1"
    );
    expect(foundChild).toBeDefined();
    // Check if foundChild is not null before accessing its properties
    if (foundChild) {
      expect(foundChild.model.name).toBe("grandchild1");
    }
  });

  test("getPath should return the path from the current node to a child node", () => {
    const childToFindPath = rootNode.children[0].children[0];
    const path = rootNode.getPath(childToFindPath);

    // Update the expected path to match the actual structure
    const expectedPath = [rootNode, rootNode.children[0], childToFindPath];

    expect(path).toEqual(expectedPath);
  });

  test("getReversePath should return the reverse path from a child node to the current node", () => {
    const childToFindPath = rootNode.children[0].children[0];
    const reversePath = rootNode.getReversePath(childToFindPath);
    expect(reversePath).toEqual([
      childToFindPath,
      rootNode.children[0],
      rootNode,
    ]);
  });

  test("getParent should return the parent node of a child node", () => {
    const child = rootNode.children[0].children[0];
    const parent = rootNode.getParent(child);
    expect(parent).toBe(rootNode.children[0]);
  });

  test("findChildren should find all child nodes matching a predicate", () => {
    const foundChildren = rootNode.findChildren(
      (node) => node.model.data.value > 20
    );
    expect(foundChildren).toHaveLength(1);
    expect(foundChildren[0].model.name).toBe("child2");
  });

  test("deleteChildren should delete all child nodes matching a predicate", () => {
    rootNode.deleteChildren((node) => node.model.data.value > 20);
    expect(rootNode.children).toHaveLength(1);
    expect(rootNode.children[0].model.name).toBe("child1");
  });

  test("insertChild should insert a new child node based on a predicate", () => {
    const newChild = new TreeNode(
      { id: 6, name: "newChild", data: { value: 70 } },
      6,
      defaultTraversalStrategy
    );

    rootNode.insertChild(newChild, (node) => node.model.data.value > 20);

    const insertedNode = rootNode.findChild(
      (node) => node.model.name === "newChild"
    );
    expect(insertedNode).toBeDefined();
    expect(insertedNode!.model.name).toBe("newChild");
  });

  test("depthFirstSearch should perform a depth-first search in pre-order", () => {
    const result = rootNode.depthFirstSearch(rootNode, "pre-order");
    const expectedOrder = [
      rootNode,
      rootNode.children[0],
      rootNode.children[0].children[0],
      rootNode.children[1],
    ];
    expect(result).toEqual(expectedOrder);
  });

  test("depthFirstSearch should perform a depth-first search in post-order", () => {
    const result = rootNode.depthFirstSearch(rootNode, "post-order");
    const expectedOrder = [
      rootNode.children[0].children[0],
      rootNode.children[0],
      rootNode.children[1],
      rootNode,
    ];
    expect(result).toEqual(expectedOrder);
  });

  test("depthFirstSearch should perform a depth-first search in reverse pre-order", () => {
    const result = rootNode.depthFirstSearch(rootNode, "reverse-pre-order");
    const expectedOrder = [
      rootNode.children[1],
      rootNode.children[0].children[0],
      rootNode.children[0],
      rootNode,
    ];

    expect(result).toEqual(expectedOrder);
  });

  test("breadthFirstOrder should return nodes in breadth-first order", () => {
    const result = rootNode.breadthFirstOrder(rootNode);
    const expectedOrder = [
      rootNode,
      rootNode.children[0],
      rootNode.children[1],
      rootNode.children[0].children[0],
    ];
    expect(result).toEqual(expectedOrder);
  });
});
