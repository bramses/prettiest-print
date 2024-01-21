const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");

const parser = new Parser();
parser.setLanguage(JavaScript);

const sourceCode2 = "let x = 1; console.log(x);";
const sourceCode = `export async function quosLogic(query) {
    const response = await fetch(quoordinates_server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const json = await response.json();
    return json;
}

function traverse(node) {
    if (node.isNamed) {
      children.push(node)
    }
    for (let i = 0; i < node.childCount; i++) {
      traverse(node.child(i))
    }
}

const rootChildren = tree.rootNode.children;

console.log(lastColumn, lastLine)`

const tree = parser.parse(sourceCode);

// traverse the tree until all the leaf node children are found
let children = []

function traverse(node) {
  if (node.isNamed) {
    children.push(node)
  }
  for (let i = 0; i < node.childCount; i++) {
    traverse(node.child(i))
  }
}

traverse(tree.rootNode)

const lastChild = children[children.length - 1];
const lastColumn = lastChild.endPosition.column;
const lastLine = lastChild.endPosition.row;

// using the last column and row of the last child, create a 2d array close to square as possible
const squareLength = Math.ceil(Math.sqrt(lastColumn * lastLine));
// next we need to figure out how much vertical space each root child takes up by getting the row where the child ends and subtracting the row where the child starts
const rootChildren = tree.rootNode.children;

const rootChildrenRows = rootChildren.map(child => {
    return child.endPosition.row - child.startPosition.row + 1;
})

// fit the root children into squareLength by proportionally scaling the root children rows
const rootChildrenRowsSum = rootChildrenRows.reduce((a, b) => a + b, 0);

const rootChildrenRowsScaled = rootChildrenRows.map(row => {
    return Math.round(row * squareLength / rootChildrenRowsSum);
})

// next we need to scale columns for each root child into squareLength by finding the longest column and scaling the rest of the columns proportionally
// TODO: recursively check children for longest column
// TODO: scale columns proportionally
// TODO: will this create an annoying amount of blank space? How can I take advantage of the space creatively?
const longestColumn = rootChildren.reduce((a, b) => {
    return a.endPosition.column > b.endPosition.column ? a : b;
})

const longestColumnLength = longestColumn.endPosition.column;
console.log(longestColumnLength);

// log the children
children.forEach(child => {
  console.log(child)
})

