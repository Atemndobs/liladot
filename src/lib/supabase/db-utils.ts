import { supabase } from './client';
import { Tables, TableName, TableRow, TableInsert, TableUpdate } from './database.types';
import { PaginationOptions, PaginatedResponse } from './shared.types';

/**
 * Helper to handle paginated queries
 */
export async function paginateQuery<T extends TableName>(
  table: T,
  options: PaginationOptions = {}
): Promise<PaginatedResponse<TableRow<T>>> {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // First, get the total count
  const { count, error: countError } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  // Then get the paginated data
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to);

  if (error) throw error;

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as TableRow<T>[],
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

/**
 * Helper to create a record with type safety
 */
export async function createRecord<T extends TableName>(
  table: T,
  record: TableInsert<T>
): Promise<TableRow<T>> {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data as TableRow<T>;
}

/**
 * Helper to update a record with type safety
 */
export async function updateRecord<T extends TableName>(
  table: T,
  id: string,
  updates: Partial<TableUpdate<T>>
): Promise<TableRow<T>> {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as TableRow<T>;
}

/**
 * Helper to delete a record
 */
export async function deleteRecord<T extends TableName>(
  table: T,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Helper to find a record by ID
 */
export async function findById<T extends TableName>(
  table: T,
  id: string
): Promise<TableRow<T> | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return null;
    }
    throw error;
  }

  return data as TableRow<T>;
}

/**
 * Helper to find records by a column value
 */
export async function findByColumn<T extends TableName, K extends keyof TableRow<T>>(
  table: T,
  column: K,
  value: TableRow<T>[K]
): Promise<TableRow<T>[]> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column as string, value as any);

  if (error) throw error;
  return data as TableRow<T>[];
}

/**
 * Helper to check if a record exists
 */
export async function exists<T extends TableName>(
  table: T,
  column: keyof TableRow<T>,
  value: any
): Promise<boolean> {
  const { data, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column as string, value)
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
}
