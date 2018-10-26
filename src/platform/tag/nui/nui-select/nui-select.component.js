"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var codename_1 = require("../../../service/codename/codename");
var NuiSelectComponent = (function () {
    function NuiSelectComponent(codeNameService) {
        this.codeNameService = codeNameService;
        this.id = "";
        this.contain = "";
        this.noContain = "";
        this.change = new core_1.EventEmitter();
        this.nullCodeName = [new codename_1.CodeName(null, this.nullLabel ? this.nullLabel : '全选')];
    }
    NuiSelectComponent.prototype.ngOnInit = function () {
        // 如果没有设置数组数据，则使用codetype进行查询
        if (!this.codeName) {
            this.codeNameList = this.nullCodeName.concat(this.codeNameService.getCodename(this.codetype));
            this.ngOnfilter();
        }
        else {
            this.codeNameList = this.codeName;
            this.ngOnfilter();
        }
    };
    NuiSelectComponent.prototype.ngOnfilter = function () {
        //如果设置contain属性则只显示contain中包含的数据
        if (this.contain != "") {
            var temp = [];
            var contains = this.contain.split(',');
            for (var i = 0; i < contains.length; i++) {
                for (var n = 0; n < this.codeNameList.length; n++) {
                    if (contains[i] == this.codeNameList[n].value) {
                        // this.codeNameList.splice(n,1);
                        temp.push(new codename_1.CodeName(this.codeNameList[n].value, this.codeNameList[n].label));
                        break;
                    }
                }
            }
            this.codeNameList = temp;
        }
        //如果设置noContain属性则把noContain中的值从列表中去除
        if (this.noContain != "") {
            var temp = [];
            for (var i = 0; i < this.codeNameList.length; i++) {
                temp.push(new codename_1.CodeName(this.codeNameList[i].value, this.codeNameList[i].label));
            }
            var noContains = this.noContain.split(',');
            for (var i = 0; i < noContains.length; i++) {
                for (var n = 0; n < temp.length; n++) {
                    if (noContains[i] == temp[n].value) {
                        temp.splice(n, 1);
                        break;
                    }
                }
            }
            this.codeNameList = temp;
        }
    };
    /**
     * 当Input参数发生了变化时，使用新的入参进行赋值
     * @param changes
     */
    NuiSelectComponent.prototype.ngOnChanges = function (changes) {
        for (var propName in changes) {
            if (propName == 'codeName') {
                // 此处必须重新设定下拉列表内容，否则页面上无法显示。不过PrimeNG原生的标签此处不设定也可以。
                this.codeNameList = (changes['codeName']).currentValue;
                this.ngOnfilter();
            }
            else if (propName == 'codetype') {
                //此处codetype发生变化时，重新按新的codetype进行查询 add by 张宏喜  20170615
                this.codeNameList = this.codeNameService.getCodename(this.codetype);
                this.ngOnfilter();
            }
        }
    };
    /**
     * 封装标签内的onChange事件
     * @param $event
     */
    NuiSelectComponent.prototype.onChangeExd = function ($event) {
        // console.log("nui-select onchange" + this.id + "=" + $event.value );
        if ($event) {
            var others = void 0;
            for (var i = 0; i < this.codeNameList.length; i++) {
                if (this.codeNameList[i].value == $event.value) {
                    others = {
                        label: this.codeNameList[i].label,
                    };
                    break;
                }
            }
            var selectEvent = new SelectEventComponent(this.id, $event.value, others);
            // 如果设定了onChange事件，就执行
            if (this.change) {
                this.change.emit(selectEvent);
            }
        }
    };
    return NuiSelectComponent;
}());
__decorate([
    core_1.Input()
], NuiSelectComponent.prototype, "codetype", void 0);
__decorate([
    core_1.Input('controlname')
], NuiSelectComponent.prototype, "formControlName", void 0);
__decorate([
    core_1.Input()
], NuiSelectComponent.prototype, "id", void 0);
__decorate([
    core_1.Input('group')
], NuiSelectComponent.prototype, "signupForm", void 0);
__decorate([
    core_1.Input('codeName')
], NuiSelectComponent.prototype, "codeName", void 0);
__decorate([
    core_1.Input('filter')
], NuiSelectComponent.prototype, "filter", void 0);
__decorate([
    core_1.Input('contain')
], NuiSelectComponent.prototype, "contain", void 0);
__decorate([
    core_1.Input('noContain')
], NuiSelectComponent.prototype, "noContain", void 0);
__decorate([
    core_1.Input('disabled')
], NuiSelectComponent.prototype, "disabled", void 0);
__decorate([
    core_1.Input('model')
], NuiSelectComponent.prototype, "model", void 0);
__decorate([
    core_1.Input('nullLabel')
], NuiSelectComponent.prototype, "nullLabel", void 0);
__decorate([
    core_1.Output()
], NuiSelectComponent.prototype, "change", void 0);
NuiSelectComponent = __decorate([
    core_1.Component({
        selector: 'nui-select',
        template: "\n        <div *ngIf=\"signupForm\" [formGroup]=\"signupForm\">\n          <p-dropdown [options]=\"codeNameList\" id=\"{{id}}\" name=\"{{id}}\" formControlName=\"{{formControlName}}\" [filter]=\"filter\" [disabled]=\"disabled\"\n                  [autoWidth]=\"false\" tooltipPosition=\"top\" (onChange)=\"onChangeExd($event)\" appendTo=\"body\">\n          </p-dropdown>\n        </div>\n        <div *ngIf=\"!signupForm\" >\n          <p-dropdown [options]=\"codeNameList\" id=\"{{id}}\" name=\"{{id}}\" [filter]=\"filter\" [disabled]=\"disabled\" [(ngModel)]=\"model\" \n                  [autoWidth]=\"false\" tooltipPosition=\"top\" (onChange)=\"onChangeExd($event)\" appendTo=\"body\">\n          </p-dropdown>\n        </div>\n        ",
        styleUrls: []
    })
], NuiSelectComponent);
exports.NuiSelectComponent = NuiSelectComponent;
var SelectEventComponent = (function () {
    function SelectEventComponent(id, newValue, others) {
        this.id = id;
        // this.oldValue = oldValue;
        this.newValue = newValue;
        this.others = others;
    }
    return SelectEventComponent;
}());
exports.SelectEventComponent = SelectEventComponent;
