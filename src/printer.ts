import { FastPath, Doc, doc } from 'prettier';
import { ASTNode } from 'glsl-parser';

interface Print {
  (path: FastPath): Doc;
}
// interface Visitor { (path: FastPath, print: Print): Doc; }

const { concat, hardline, line, indent, join, group } = doc.builders;
const groupConcat = (docs: Doc[]) => group(concat(docs));
const groupJoin = (seperator: Doc, docs: Doc[]) => group(join(seperator, docs));

const handleDeclList = () => {};

export function print(path: FastPath, options: any, print: Print): Doc {
  const { originalText } = options;
  const node = path.getValue() as ASTNode;
  const printChildren = () => path.map(print, 'children').filter(c => c !== '');
  if (!node) return '';
  switch (node.type) {
    case 'stmtlist':
      return concat([line, ...printChildren()]);
    case 'decllist':
      return concat([...printChildren(), node.token.data, '\n']);
    case 'preprocessor':
      return concat([node.token.data, hardline]);
    case 'precision':
      return concat([join(line, [node.token.data, ...printChildren()]), ';\n']);
    case 'stmt':
    case 'expr':
      return node.expecting && node.expecting.length > 0
        ? join('', [groupJoin(line, printChildren()), ...node.expecting])
        : groupJoin(line, [...printChildren()]);
    case 'operator':
    case 'assign':
      if (node.children.length > 0) {
        const children = printChildren();
        if (children.length === 1) {
          return groupJoin(line, [node.token.data, ...children]);
        } else {
          return groupJoin(line, [children[0], node.token.data, children[1]]);
        }
      } else {
        return node.token.data;
      }
    case 'call': {
      const children = printChildren();
      return groupJoin('', [
        children[0],
        node.token.data,
        join(', ', children.slice(1)),
        ')',
      ]);
    }
    case 'decl':
      return groupJoin(' ', printChildren());
    case 'function':
      const children = printChildren();
      return groupJoin(line, [
        join('', [children[0], node.token.data, children[1]]),
        '{\n',
        children[2],
        '\n}',
      ]);
    default:
      return node.token.data;
  }
}
