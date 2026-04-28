import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricsDataComponent } from './metrics-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MetricsDataComponent // ✅ IMPORT instead of DECLARE
  ],
  exports: [MetricsDataComponent]
})
export class MetricsDataModule {}
