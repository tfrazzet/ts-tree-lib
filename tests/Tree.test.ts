import { Tree } from "../src/Tree";
import { TreeNode } from "../src/TreeNode";

describe("Tree", () => {
  let tree: Tree<{ id: number; name: string; data: { value: number } }>;

  beforeEach(() => {
    // Create a sample tree for testing
    const treeData = {
      model: { id: 0, name: "root", data: { value: 10 } },
      index: 0,
      children: [
        {
          model: { id: 1, name: "child1", data: { value: 20 } },
          index: 1,
          children: [
            {
              model: { id: 3, name: "grandchild1", data: { value: 40 } },
              index: 1,
              children: [],
            },
          ],
        },
        {
          model: { id: 2, name: "child2", data: { value: 30 } },
          index: 2,
          children: [],
        },
      ],
    };

    tree = new Tree(treeData);
  });

  test("all should return all nodes in the tree", () => {
    const allNodes = tree.all();
    expect(allNodes).toHaveLength(4); // 4 nodes in total: root, child1, grandchild1, child2
  });

  test("remove should remove a node from the tree", () => {
    const nodeToRemove =
      tree.find((node) => node.model.name === "child1") ?? null;

    // Add a null check before calling remove
    if (nodeToRemove) {
      tree.remove(nodeToRemove);
    } else {
      // Handle the case where targetNode is null (optional)
      console.log('remove: Target "child1" node not found. :>>', tree);
    }

    const allNodes = tree.all();
    expect(allNodes).toHaveLength(2); // 2 nodes remaining: root and child2
  });

  test("find should find a node based on a predicate", () => {
    const foundNode = tree.find((node) => node.model.data.value === 30);
    expect(foundNode).not.toBeNull();
    expect(foundNode?.model.name).toBe("child2");
  });

  test("move should move a node to a new parent", () => {
    const nodeToMove = tree.find((node) => node.model.name === "child1");
    const newParent = tree.find((node) => node.model.name === "child2");

    if (nodeToMove && newParent) {
      // Move the node
      tree.move(nodeToMove, newParent);

      // Check if the node is moved to the new parent by comparing names
      expect(tree.root?.getParent(nodeToMove)).toBe(newParent);
    } else {
      // Handle the case where targetNode is null (optional)
      if (!nodeToMove) {
        console.log('move: Node to move "child1" not found. :>>', tree);
      }

      if (!newParent) {
        console.log('move: New parent node "child2" not found. :>>', tree);
      }
    }
  });

  test("getPath should return the path from the root to a node", () => {
    const targetNode = tree.find((node) => node.model.name === "grandchild1");

    // Add a null check before calling getPath
    if (targetNode) {
      const path = tree.getPath(targetNode);

      expect(path).toHaveLength(3); // 3 nodes in the path: root, child1, grandchild1
      expect(path?.[0].model.name).toBe("root");
      expect(path?.[1].model.name).toBe("child1");
      expect(path?.[2].model.name).toBe("grandchild1");
    } else {
      // Handle the case where targetNode is null (optional)
      console.log(
        'getReversePath: Target "grandchild1" node not found. :>>',
        tree
      );
    }
  });

  test("getReversePath should return the reverse path from a node to the root", () => {
    const targetNode = tree.find((node) => node.model.name === "grandchild1");

    // Add a null check before calling getReversePath
    if (targetNode) {
      const reversePath = tree.getReversePath(targetNode);

      expect(reversePath).toHaveLength(3); // 3 nodes in the reverse path: grandchild1, child1, root
      expect(reversePath?.[0].model.name).toBe("grandchild1");
      expect(reversePath?.[1].model.name).toBe("child1");
      expect(reversePath?.[2].model.name).toBe("root");
    } else {
      // Handle the case where targetNode is null (optional)
      console.log(
        'getReversePath: Target "grandchild1" node not found. :>>',
        tree
      );
    }
  });

  test("walk should apply a callback function to each node in the tree", () => {
    const callbackMock = jest.fn();
    tree.walk(callbackMock);

    // Check if the callback is called for each node in the tree
    expect(callbackMock).toHaveBeenCalledTimes(4); // 4 nodes in total
  });

  test("insertChild should insert a new child node based on a predicate", () => {
    const newNode = new TreeNode(
      { id: 4, name: "newNode", data: { value: 50 } },
      1
    );
    const predicate = (
      node: TreeNode<{
        id: number;
        name: string;
        data: {
          value: number;
        };
      }>
    ) => node.model.name === "child2";

    tree.insertChild(newNode, predicate);

    // Check if the new node is inserted as a child of the specified node
    const parentNode = tree.find((node) => node.model.name === "child2");
    expect(parentNode?.children).toContain(newNode);
  });
});
