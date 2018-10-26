import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TreeNode} from "primeng/primeng";
import {DialogService} from "../../../../platform/dialog/dialog.service";
import {TestService} from "../../../sungkdemo/view/imok-test/testService";
import {NodeService} from "../../../demo/service/nodeservice";
import {ConsoleArraryoperService} from "../../service/console.arraryoper.service";
import {CarService} from "../../../demo/service/carservice";
import {ConsoleService} from "../../service/console.service";
import {childOfKind} from "tslint";

@Component({
  selector: 'app-unittree',
  templateUrl: './unittree.component.html',
  styleUrls: ['./unittree.component.css']
})
export class UnittreeComponent implements OnInit {

  roles: TreeNode[];
  selRoles: TreeNode[];

  changeData: TreeNode[];
  // 将tree的两个事件抛出，留作接口使用
  @Output() onNodeExpand = new EventEmitter<any>();
  @Output() onNodeSelect = new EventEmitter<any>();

  constructor(private carService: CarService,
              private nodeService: NodeService,
              private testService: TestService,
              private conService: ConsoleService,
              private dialogService: DialogService,
              private consoleArraryoperService: ConsoleArraryoperService) {
  }

  ngOnInit() {
    let m_aa11: any = {aar001: '0', aar009: '国扶办', aaa113: '', aar033: '0'};
    // 设置root菜单
    this.roles = [
      {
        label: '国扶办', data: m_aa11, expandedIcon: 'fa-folder-open',
        collapsedIcon: 'fa-folder', icon: '', expanded: false, children: []
      },
    ];
    this.query_aa11();
  }

  query_aa11 = () => {
    let successFunc1: any = (response => {
      debugger;
      // 每次查询都情况this.changeData,保证变化列表都是新的，没有数据的
      this.changeData = [];
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res.length > 0) {
        this.roles[0].children = [];
        for (let i in res) {
          let m_node: TreeNode = {};
          m_node.label = res[i].aar009;
          m_node.data = res[i];
          m_node.children = [{}];
          m_node.expandedIcon = 'fa-folder-open';
          m_node.collapsedIcon = 'fa-folder';
          // m_node.icon = 'fa-file-image-o';
          m_node.icon = "";
          this.roles[0].children.push(m_node);
        }
      }
      this.roles[0].expanded = true;
    });

    let m_data: any = {aar033: '20', aaa113: '0'};
    this.conService.queryAa11(m_data, successFunc1);
  }

  nodeExpand = (event) => {

    let successFunc: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res.length > 0) {
        event.node.children = [];
        for (let i in res) {
          let m_node: TreeNode = {};
          m_node.label = res[i].aar009;
          m_node.data = res[i];
          // noinspection TypeScriptValidateTypes

          m_node.expandedIcon = 'fa-folder-open';
          m_node.collapsedIcon = 'fa-folder';
          if (event.node.data.aar033 == '60') {
            m_node.icon = 'fa-file-image-o';
            m_node.children = [];
          } else {
            m_node.icon = "";
            m_node.children = [{}];
          }
          event.node.children.push(m_node);
        }
      } else {
        event.node.children = [];
        event.node.icon = 'fa-file-image-o';
      }
      // this.onNodeExpand.emit(event);
    });
    debugger;
    if (event.node) {
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      // this.nodeService.getLazyFiles().then(nodes => event.node.children = nodes);
      const item = event.node.data;
      if (item.aar033 == '0')
        return;
      if (item.aar033 == '70') {
        event.node.icon = "fa-file-image-o";
        event.node.children = [];
        return;
      } else {
        let aar033 = '';
        switch (item.aar033) {
          case '0':
            aar033 = '20';
            break;
          case '20':
            aar033 = '40';
            break;
          case '40':
            aar033 = '50';
            break;
          case '50':
            aar033 = '60';
            break;
          case '60':
            aar033 = '70';
            break;
          case '70':
            break;
        }
        let m_data: any = {aar033: aar033, aaa113: item.aar001};
        this.conService.queryAa11(m_data, successFunc);
      }
    }

  }

  nodeSelect = ($event) => {
    // this.onNodeSelect.emit($event);
    debugger;
  //  数选择事件，注意当选择父节点的时候，子节点是默认选中的，所以需要手工处理，
  //  方式由于框架的自动选择，造成无法控制的情况
    const item = $event.node.data;
    const children = $event.node.children;
  //  根据节点的标志aar033进行控制，必须选择到村，才能进行授权，否则不予处理
    if (item.aar033 =="70") {
    //  判断changeData是否存在，如果不存在则增加一条，如果存在那么修改其addflg标志，1位增加 -1位减少
      for(let i in this.changeData) {
        if(this.changeData[i]['aar001'] == item.aar001) {
          this.changeData[i]['addflg'] ='1';
        }else{
          this.changeData[i]['addflg'] ='1';
          this.changeData.push(item);
        }
      }
    }else{
    //  自动选择其子节点
      if(children){
        this.childNodeSelect($event.node,'1');
      }
    }

  }

  childNodeSelect = (node: TreeNode,addflg: string) => {
    if(node.children){
      for(let i in node.children){
        this.childNodeSelect(node.children[i],addflg);
      }
    }else{
      for(let i in this.changeData) {
        if(this.changeData[i]['aar001'] == node.data.aar001) {
          this.changeData[i]['addflg'] =addflg;

        }else{
          node.data['addflg'] =addflg;
          this.changeData.push(node.data);
          this.selRoles.push(node);
        }
      }
    }
}

  //
  nodeUnselect = ($event) => {

  }


}
