// src/features/tables/hooks/useTables.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables, updateTableStatus, updateTable, setSelectedTable } from '../store/tableStore';

export const useTables = ({ enabled = true } = {}) => {
  const dispatch = useDispatch();
  const { tables, selectedTable, loading, error } = useSelector(
    // The current application store does not mount the legacy tables slice.
    // TableMap2D can still receive API tables as props in picker mode.
    (state) => state.tables ?? { tables: [], selectedTable: null, loading: false, error: null }
  );

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
