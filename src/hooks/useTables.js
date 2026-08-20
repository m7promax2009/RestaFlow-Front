// src/features/tables/hooks/useTables.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables, updateTableStatus, updateTable, setSelectedTable } from '../store/tableStore';

// Stable fallback so the selector never returns a new object reference.
const EMPTY_TABLES = [];
const FALLBACK = { tables: EMPTY_TABLES, selectedTable: null, loading: false, error: null };

export const useTables = ({ enabled = true } = {}) => {
  const dispatch = useDispatch();

  const tables = useSelector((state) => state.tables?.tables ?? FALLBACK.tables);
  const selectedTable = useSelector((state) => state.tables?.selectedTable ?? FALLBACK.selectedTable);
  const loading = useSelector((state) => state.tables?.loading ?? FALLBACK.loading);
  const error = useSelector((state) => state.tables?.error ?? FALLBACK.error);

  useEffect(() => {
    if (enabled) dispatch(fetchTables());
  }, [dispatch, enabled]);

  const changeStatus = async (id, status) => {
    try {
      await dispatch(updateTableStatus({ id, status })).unwrap();
      return { success: true };
    } catch (err) {
      console.error('Stol holatini yangilashda xatolik:', err);
      return { success: false, error: err };
    }
  };

  const updateTableData = async (id, data) => {
    try {
      await dispatch(updateTable({ id, data })).unwrap();
      return { success: true };
    } catch (err) {
      console.error('Stol maʼlumotlarini yangilashda xatolik:', err);
      return { success: false, error: err };
    }
  };

  const selectTable = (table) => {
    dispatch(setSelectedTable(table));
  };

  return {
    tables,
    selectedTable,
    loading,
    error,
    changeStatus,
    updateTableData,
    selectTable,
    refetch: () => dispatch(fetchTables()),
  };
};
