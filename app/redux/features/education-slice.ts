import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import pb from "@/utils/pocketbase-connect";
import { AppDispatch } from '../store';
import { RecordModel } from 'pocketbase';

// Define interfaces for the education record structure
interface EducationRecord extends RecordModel {
    degree: string;            // e.g., MBBS, MS
    specialization: string;    // e.g., Physiology, E.N.T.
    user: string;             // reference to user ID
    collectionId: string;
    collectionName: string;
    id: string;
    created: string;
    updated: string;
}

// Define the state interface for multiple education records
interface EducationState {
    records: EducationRecord[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: EducationState = {
    records: [],
    loading: false,
    error: null
};

// Education slice
const educationSlice = createSlice({
    name: 'education',
    initialState,
    reducers: {
        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Set all education records
        setEducationRecords: (state, action: PayloadAction<EducationRecord[]>) => {
            state.records = action.payload;
        },

        // Add a single education record
        addEducationRecord: (state, action: PayloadAction<EducationRecord>) => {
            state.records.push(action.payload);
        },

        // Update a single education record
        updateEducationRecord: (state, action: PayloadAction<EducationRecord>) => {
            const index = state.records.findIndex(record => record.id === action.payload.id);
            if (index !== -1) {
                state.records[index] = action.payload;
            }
        },

        // Remove a single education record
        removeEducationRecord: (state, action: PayloadAction<string>) => {
            state.records = state.records.filter(record => record.id !== action.payload);
        }
    },
});

// Export actions
export const {
    setLoading,
    setError,
    setEducationRecords,
    addEducationRecord,
    updateEducationRecord,
    removeEducationRecord
} = educationSlice.actions;

// Export reducer
export default educationSlice.reducer;

// Async thunks for API interactions
export const fetchEducationRecords = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const records = await pb.collection('user_credentials').getFullList({
            filter: `user="${userId}"`,
            sort: '-created',
        });
        
        dispatch(setEducationRecords(records as EducationRecord[]));
        dispatch(setError(null));
    } catch (error) {
        console.error('Error fetching education records:', error);
        dispatch(setError('Failed to fetch education records'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const createEducationRecord = (
    userId: string,
    educationData: Partial<EducationRecord>
) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const record = await pb.collection('user_credentials').create({
            ...educationData,
            user: userId
        });
        dispatch(addEducationRecord(record as EducationRecord));
        dispatch(setError(null));
    } catch (error) {
        console.error('Error creating education record:', error);
        dispatch(setError('Failed to create education record'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateEducationRecordById = (
    recordId: string,
    educationData: Partial<EducationRecord>
) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const record = await pb.collection('user_credentials').update(recordId, educationData);
        dispatch(updateEducationRecord(record as EducationRecord));
        dispatch(setError(null));
    } catch (error) {
        console.error('Error updating education record:', error);
        dispatch(setError('Failed to update education record'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const deleteEducationRecord = (recordId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        await pb.collection('user_credentials').delete(recordId);
        dispatch(removeEducationRecord(recordId));
        dispatch(setError(null));
    } catch (error) {
        console.error('Error deleting education record:', error);
        dispatch(setError('Failed to delete education record'));
    } finally {
        dispatch(setLoading(false));
    }
};