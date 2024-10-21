// src/components/DateFilter.js

import React from 'react';
import { TextField } from '@mui/material';

const DateFilter = ({ startDate, setStartDate, endDate, setEndDate }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ width: '45%' }}
            />
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ width: '45%' }}
            />
        </div>
    );
};

export default DateFilter;
