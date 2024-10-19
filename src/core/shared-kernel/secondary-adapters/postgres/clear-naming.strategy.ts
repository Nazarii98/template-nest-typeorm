import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export default class ClearNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  public indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    return 'IDX_' + this.takeTableName(tableOrName) + '_' + columnNames.join('_') + (where ? `__${where}` : '');
  }

  public uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return 'IDX_UNIQ_' + this.takeTableName(tableOrName) + '_' + columnNames.join('_');
  }

  public primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return 'PK_' + this.takeTableName(tableOrName) + '_' + columnNames.join('_');
  }

  public foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
  ): string {
    return (
      'FK_' +
      this.takeTableName(tableOrName) +
      '_' +
      _referencedTablePath +
      '_' +
      columnNames.join('_') +
      '_' +
      _referencedColumnNames.join('_')
    );
  }

  private takeTableName(tableOrName: Table | string): string {
    return tableOrName instanceof Table ? tableOrName.name : tableOrName;
  }
}
