import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@renderer/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
