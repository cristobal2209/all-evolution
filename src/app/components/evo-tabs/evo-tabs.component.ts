import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { EVO_DATA } from '../../data/evo-data';
import { EVOModel, VariantSpecs } from '../../models/evo.model';
import { FluidTableComponent } from '../fluid-table/fluid-table.component';

@Component({
  selector: 'app-evo-tabs',
  standalone: true,
  imports: [MatTabsModule, MatAccordion, MatExpansionModule, MatIconModule, FluidTableComponent],
  templateUrl: './evo-tabs.component.html',
  styleUrl: './evo-tabs.component.scss',
})
export class EvoTabsComponent {
  evoModels = EVO_DATA;
  selectedVariant: Record<number, string> = {};

  constructor() {
    for (const model of this.evoModels) {
      this.selectedVariant[model.id] = model.variants[0];
    }
  }

  getSpecs(model: EVOModel): VariantSpecs {
    const variant = this.selectedVariant[model.id];
    return model.specs[variant];
  }

  onVariantChange(modelId: number, variant: string): void {
    this.selectedVariant[modelId] = variant;
  }
}
