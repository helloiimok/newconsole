import {Component, OnInit} from '@angular/core';
import {TreeNode} from "primeng/primeng";
import {TestService} from "../../../sungkdemo/view/imok-test/testService";
import {DialogService} from "../../../../platform/dialog/dialog.service";
import {NodeService} from "../../../demo/service/nodeservice";
import {ConsoleArraryoperService} from "../../service/console.arraryoper.service";
import {CarService} from "../../../demo/service/carservice";
import {ConsoleService} from "../../service/console.service";

@Component({
  selector: 'app-selecttree',
  templateUrl: './selecttree.component.html',
  styleUrls: ['./selecttree.component.css']
})
export class SelecttreeComponent implements OnInit {
  roles: TreeNode[];
  selRoles: TreeNode[];

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
      // this.changeData = [];
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

  nodeExpand(event) {

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

  nodeSelect = (event) => {
    debugger;
    const item = event.node.data;
    // this.queryBusiRole(item.aar001);
  }


}
