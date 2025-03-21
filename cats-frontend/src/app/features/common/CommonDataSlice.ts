import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from '../../helpers/requests/status';

const initialState = {
  error: '',
  fetchStatus: RequestStatus.idle,
  lookUpValues: {},
};

const commonDataSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
});

export default commonDataSlice.reducer;
