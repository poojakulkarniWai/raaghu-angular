import { AfterViewInit, Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Tooltip } from 'bootstrap'

@Component({
  selector: 'rds-textarea',
  templateUrl: './rds-textarea.component.html',
  styleUrls: ['./rds-textarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RdsTextareaComponent),
    multi: true,
  }]
})
export class RdsTextareaComponent implements AfterViewInit, ControlValueAccessor {

  static count = 0;
  @Input() value = '';
  private onTouched!: Function;
  private onChanged!: Function;

  @Input() isRequired: boolean = false;
  @Input() disabled: boolean = false;
  @Input() rows?: string;
  @Input() readonly?: boolean = false;
  @Input() label: string = '';
  @Input() isFloatingInputLabel: boolean = false;
  @Input() placeholderText: string = '';
  @Input() tooltipTitle: string = '';
  @Input() tooltipPlacement: 'top' | 'bottom' | 'right' | 'left' = 'bottom';
  @Input() labelPosition: 'top' | 'bottom' = 'top';
  @Input() id: string = 'textareaId';

  constructor() {
    this.id = this.id + RdsTextareaComponent.count++;
  }


  ngAfterViewInit(): void {
    const tooltipTriggerList: any = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    if (this.tooltipTitle && tooltipTriggerList) {
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }
    // if (this.tooltipPlacement && this.tooltipTitle) {
    //   const tooltipElement: any = document.getElementById(this.id)
    //   // update
    //   if (tooltipElement) {
    //     let bsTooltip = new bootstrap.Tooltip(tooltipElement)
    //     tooltipElement.title = this.tooltipTitle
    //     bsTooltip = new bootstrap.Tooltip(tooltipElement)
    //   }
    // }
  }

  setValue(event: any) {
    this.value = event.target.value
    this.onTouched(); // <-- mark as touched
    this.onChanged(this.value);
  }

  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChanged = fn; // <-- save the function
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn; // <-- save the function
  }

  public get divclasses(): string[] {
    var classList = ['mb-0']
    if (this.isFloatingInputLabel === true) {
      classList.push('form-floating');
    }
    else {
      classList.push('');
    }
    return classList
  }

}
