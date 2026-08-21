import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RecommendedOil, Rating } from '../../models/evo.model';

@Component({
  selector: 'app-fluid-table',
  standalone: true,
  imports: [MatTableModule],
  template: `
    <div class="fluid-table-container">
      <h4 class="table-title">{{ title() }}</h4>
      <div class="table-scroll">
        <table mat-table [dataSource]="oils()" class="fluid-table">
          <ng-container matColumnDef="brand">
            <th mat-header-cell *matHeaderCellDef>Marca</th>
            <td mat-cell *matCellDef="let oil">{{ oil.brand }}</td>
          </ng-container>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Producto</th>
            <td mat-cell *matCellDef="let oil">{{ oil.product }}</td>
          </ng-container>

          <ng-container matColumnDef="viscosity">
            <th mat-header-cell *matHeaderCellDef>Viscosidad</th>
            <td mat-cell *matCellDef="let oil" class="viscosity-cell">{{ oil.viscosity }}</td>
          </ng-container>

          <ng-container matColumnDef="norms">
            <th mat-header-cell *matHeaderCellDef>Normas</th>
            <td mat-cell *matCellDef="let oil">
              <div class="norms-cell">
                @for (norm of oil.norms; track norm) {
                  <span class="norm-badge">{{ norm }}</span>
                }
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="daily">
            <th mat-header-cell *matHeaderCellDef class="rating-header">Daily</th>
            <td mat-cell *matCellDef="let oil" class="rating-cell">
              <span class="rating-dot" [class]="'dot-' + oil.daily"></span>
            </td>
          </ng-container>

          <ng-container matColumnDef="trackDay">
            <th mat-header-cell *matHeaderCellDef class="rating-header">Track Day</th>
            <td mat-cell *matCellDef="let oil" class="rating-cell">
              <span class="rating-dot" [class]="'dot-' + oil.trackDay"></span>
            </td>
          </ng-container>

          <ng-container matColumnDef="fullRacing">
            <th mat-header-cell *matHeaderCellDef class="rating-header">Competición</th>
            <td mat-cell *matCellDef="let oil" class="rating-cell">
              <span class="rating-dot" [class]="'dot-' + oil.fullRacing"></span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
      <div class="rating-legend">
        <span class="legend-item"><span class="rating-dot dot-high"></span> Recomendado</span>
        <span class="legend-item"><span class="rating-dot dot-medium"></span> Aceptable</span>
        <span class="legend-item"><span class="rating-dot dot-low"></span> No recomendado</span>
      </div>
    </div>
  `,
  styles: `
    .fluid-table-container {
      margin-bottom: 1.5rem;
    }

    .table-title {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--accent-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-scroll {
      overflow-x: auto;
    }

    .fluid-table {
      width: 100%;
      background: transparent;
      min-width: 700px;
    }

    .fluid-table .mat-mdc-header-row {
      background: rgba(255, 255, 255, 0.05);
    }

    .fluid-table .mat-mdc-header-cell {
      color: var(--accent-color);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0 8px;
    }

    .fluid-table .mat-mdc-cell {
      font-size: 0.8rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.85);
      padding: 0 8px;
    }

    .fluid-table .mat-mdc-row:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .viscosity-cell {
      font-weight: 600;
      color: var(--accent-color) !important;
    }

    .norms-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .norm-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
    }

    .rating-header {
      text-align: center !important;
    }

    .rating-cell {
      text-align: center;
    }

    .rating-dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .dot-high {
      background: #4caf50;
      box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
    }

    .dot-medium {
      background: #ff9800;
      box-shadow: 0 0 6px rgba(255, 152, 0, 0.5);
    }

    .dot-low {
      background: #f44336;
      box-shadow: 0 0 6px rgba(244, 67, 54, 0.5);
    }

    .rating-legend {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .legend-item .rating-dot {
      width: 8px;
      height: 8px;
    }
  `,
})
export class FluidTableComponent {
  title = input.required<string>();
  oils = input.required<RecommendedOil[]>();
  displayedColumns = ['brand', 'product', 'viscosity', 'norms', 'daily', 'trackDay', 'fullRacing'];
}
