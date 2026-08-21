import { Component, effect, input, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RecommendedOil, Rating } from '../../models/evo.model';

const RATING_LABELS: Record<Rating, string> = {
  high: 'Recomendado',
  medium: 'Aceptable',
  low: 'No recomendado',
  none: 'N/A',
};

const RATING_ORDER: Record<Rating, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

@Component({
  selector: 'app-fluid-table',
  standalone: true,
  imports: [MatTableModule, MatSortModule, FormsModule],
  template: `
    <div class="fluid-table-container">
      <div class="table-header">
        <h4 class="table-title">{{ title() }}</h4>
        @if (hasActiveFilters) {
          <button type="button" class="clear-filters" (click)="clearFilters()">
            Limpiar filtros
          </button>
        }
      </div>
      <div class="table-scroll">
        <table mat-table [dataSource]="dataSource" matSort class="fluid-table">
          <ng-container matColumnDef="brand">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Marca</th>
            <td mat-cell *matCellDef="let oil">{{ oil.brand }}</td>
          </ng-container>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Producto</th>
            <td mat-cell *matCellDef="let oil">{{ oil.product }}</td>
          </ng-container>

          <ng-container matColumnDef="viscosity">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Viscosidad</th>
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
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="rating-header">Daily</th>
            <td mat-cell *matCellDef="let oil" class="rating-cell" [title]="ratingLabel(oil.daily)">
              <span class="rating-dot" [class]="'dot-' + oil.daily"></span>
            </td>
          </ng-container>

          <ng-container matColumnDef="trackDay">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="rating-header">
              Track Day
            </th>
            <td
              mat-cell
              *matCellDef="let oil"
              class="rating-cell"
              [title]="ratingLabel(oil.trackDay)"
            >
              <span class="rating-dot" [class]="'dot-' + oil.trackDay"></span>
            </td>
          </ng-container>

          <ng-container matColumnDef="fullRacing">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="rating-header">
              Competición
            </th>
            <td
              mat-cell
              *matCellDef="let oil"
              class="rating-cell"
              [title]="ratingLabel(oil.fullRacing)"
            >
              <span class="rating-dot" [class]="'dot-' + oil.fullRacing"></span>
            </td>
          </ng-container>

          <ng-container matColumnDef="brandFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell">
              <input
                type="text"
                class="column-filter"
                placeholder="Filtrar"
                [(ngModel)]="filters['brand']"
                (ngModelChange)="applyFilter()"
              />
            </th>
          </ng-container>

          <ng-container matColumnDef="productFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell">
              <input
                type="text"
                class="column-filter"
                placeholder="Filtrar"
                [(ngModel)]="filters['product']"
                (ngModelChange)="applyFilter()"
              />
            </th>
          </ng-container>

          <ng-container matColumnDef="viscosityFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell">
              <input
                type="text"
                class="column-filter"
                placeholder="Filtrar"
                [(ngModel)]="filters['viscosity']"
                (ngModelChange)="applyFilter()"
              />
            </th>
          </ng-container>

          <ng-container matColumnDef="normsFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell">
              <input
                type="text"
                class="column-filter"
                placeholder="Filtrar"
                [(ngModel)]="filters['norms']"
                (ngModelChange)="applyFilter()"
              />
            </th>
          </ng-container>

          <ng-container matColumnDef="dailyFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell"></th>
          </ng-container>

          <ng-container matColumnDef="trackDayFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell"></th>
          </ng-container>

          <ng-container matColumnDef="fullRacingFilter">
            <th mat-header-cell *matHeaderCellDef class="filter-cell"></th>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-header-row *matHeaderRowDef="filterColumns"></tr>

          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        @if (dataSource.filteredData.length === 0) {
          <p class="no-results">Sin resultados para los filtros aplicados</p>
        }
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

    .table-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .table-title {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--accent-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .clear-filters {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.7rem;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
    }

    .clear-filters:hover {
      color: var(--accent-color);
    }

    .table-scroll {
      overflow-x: auto;
    }

    .fluid-table {
      width: 100%;
      background: transparent;
      min-width: 760px;
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
      padding: 4px 8px;
      vertical-align: middle;
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

    .filter-cell {
      height: auto;
      padding-top: 0 !important;
    }

    .column-filter {
      display: block;
      width: 100%;
      max-width: 110px;
      margin: 2px 0;
      padding: 2px 6px;
      font-size: 0.68rem;
      font-weight: 400;
      letter-spacing: normal;
      text-transform: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 3px;
      color: rgba(255, 255, 255, 0.9);
      outline: none;
    }

    .column-filter::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    .column-filter:focus {
      border-color: var(--accent-color);
    }

    .no-results {
      text-align: center;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      padding: 0.75rem 0;
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
  filterColumns = [
    'brandFilter',
    'productFilter',
    'viscosityFilter',
    'normsFilter',
    'dailyFilter',
    'trackDayFilter',
    'fullRacingFilter',
  ];
  dataSource = new MatTableDataSource<RecommendedOil>([]);
  filters: Record<string, string> = {};
  readonly sort = viewChild(MatSort);

  constructor() {
    effect(() => {
      this.dataSource.data = this.oils();
    });

    effect(() => {
      const sort = this.sort();
      if (sort) {
        this.dataSource.sort = sort;
      }
    });

    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'daily':
          return RATING_ORDER[row.daily];
        case 'trackDay':
          return RATING_ORDER[row.trackDay];
        case 'fullRacing':
          return RATING_ORDER[row.fullRacing];
        default:
          return String(row[column as keyof RecommendedOil] ?? '');
      }
    };

    this.dataSource.filterPredicate = (row, filter) => {
      const active: Record<string, string> = JSON.parse(filter || '{}');
      return Object.entries(active).every(([key, value]) => {
        if (!value?.trim()) return true;
        return this.cellValue(row, key)
          .toLowerCase()
          .includes(value.trim().toLowerCase());
      });
    };
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.filters).some((value) => !!value?.trim());
  }

  applyFilter(): void {
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  clearFilters(): void {
    this.filters = {};
    this.applyFilter();
  }

  ratingLabel(rating: Rating): string {
    return RATING_LABELS[rating];
  }

  private cellValue(row: RecommendedOil, key: string): string {
    switch (key) {
      case 'norms':
        return row.norms.join(' ');
      case 'daily':
        return RATING_LABELS[row.daily];
      case 'trackDay':
        return RATING_LABELS[row.trackDay];
      case 'fullRacing':
        return RATING_LABELS[row.fullRacing];
      default: {
        const value = row[key as keyof RecommendedOil];
        return String(value ?? '');
      }
    }
  }
}
