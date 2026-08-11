import React from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { colors } from '../../themes/theme';

interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  error?: string | null;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  paginationModel?: GridPaginationModel;
  pageSizeOptions?: number[];
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  loading = false,
  error = null,
  onPaginationModelChange,
  paginationModel = { pageSize: 10, page: 0 },
  pageSizeOptions = [5, 10, 25, 50],
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: '8px' }}>
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6" color={colors.text.secondary}>
          Nenhum registro encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 'auto',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
        '& .MuiDataGrid-columnHeader': {
          backgroundColor: colors.background,
          color: colors.primary,
          fontWeight: 600,
        },
        '& .MuiDataGrid-row': {
          borderBottom: `1px solid ${colors.border}`,
          '&:hover': {
            backgroundColor: 'rgba(126, 101, 96, 0.04)',
          },
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            padding: '5px',
          },
        }}
      />
    </Box>
  );
};
