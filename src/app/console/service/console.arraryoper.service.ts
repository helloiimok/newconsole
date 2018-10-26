import {Injectable} from "@angular/core";
import {HttpService} from "../../../platform/http/http.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {TreeNode} from "primeng/primeng";

@Injectable()
export class ConsoleArraryoperService {

  constructor() {
  }

  /**
   * 根据给定的id，检索数组的行数据对象中id为给定id的行号
   * 返回值小于0，找不到元素
   * @param {any[]} arrList
   * @param id
   * @returns {number}
   */
  findByID = (arrList: any[], id): number => {
    arrList.forEach(function (value, i) {
      if (value.id == id) {
        return i;
      }
    });
    return -1;
  }

  /**
   * 展开指定的node
   * @param {any[]} node
   * @param id
   */
  expandNode = (node: any, id) => {
    debugger;
    if (node.data.id == id) {
      node.expanded = true;
    } else {
      if (node.children) {
        for (let i in node.children) {
          this.expandNode(node.children[i], id);
        }
      }
    }
  }

  findNodeByAar001(node: TreeNode[], aar001: string): boolean {
    debugger;
    let ret: boolean = false;
    let array_node: any[] =[];
    this.nodeToArray(node,array_node);
    for (let i in array_node) {
      if (array_node[i].aar001 == aar001) {
        ret = true;
        break;
      }
    }
    return ret;
  }

  nodeToArray(node: TreeNode[], ret: any[]): void {
    for (let i in node) {
      ret.push(node[i].data);
      if (node[i].children) {
        this.nodeToArray(node[i].children, ret);
      }
    }
  }


  /**
   * 遍历当前节点的子节点，将所有的直接点都放到返回的数组中，并增加一个addflg的属性='1'
   * @param {any[]} treenode
   * @returns {any[]}
   */
  queryTreeNode(treenode: any, changeDate: any[], opt: string): void {
    if (treenode.children && treenode.children.length > 0) {
      for (let i in treenode.children) {
        this.queryTreeNode(treenode.children[i], changeDate, opt);
      }
    } else {
      // 设置标志位addflg,后期在存储过程中使用
      // treenode[i].data['addflg'] =addflg;
      if (opt == 'add') {
        treenode.data['addflg'] = '1';
        treenode.data['opt'] = 'add';

        changeDate.push(treenode.data);


      }
      if (opt == 'del') {
        treenode.data['addflg'] = '-1';
        treenode.data['opt'] = 'del';

        changeDate.push(treenode.data);

      }
    }
    // return changeDate;
  }


}
