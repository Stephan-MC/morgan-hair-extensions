import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
} from '@angular/core';

@Component({
  selector: 'web-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
  host: {
    '[class.selected]': 'selected()',
    '[attr.role]': '"button"',
    '(click)': '[selected.set(!selected()), select.emit()]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  value = input<string>('');
  _selected = input<boolean>(false, { alias: 'selected' });
  select = output();

  protected selected = linkedSignal(() => this._selected());
}
