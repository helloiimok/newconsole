/**
 * Created by jins on 2017/3/10.
 */
export class CodeName {

  label: string;
  value: string;
  effective?: boolean;


constructor(value: string, label: string, effective?: boolean) {
  this.label = label;
  this.value = value;
  this.effective = effective;
}

}
