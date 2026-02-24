import api from './api';
import { dummyMenu } from '../utils/dummyData';

export const fetchMenu = () => {
  return Promise.resolve({ data: dummyMenu });
};

export const fetchCategories = () => {
  const categories = [...new Set(dummyMenu.map(item => item.category))];
  return Promise.resolve({ data: categories });
};