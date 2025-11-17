import db from "../Database"
import { selectOperationsByEmployee, selectOperationsNoSync } from "../queries/operations"

export const getOperations = async (userUid: string) => {
  try {
    const result = await db.getAllAsync(selectOperationsByEmployee, [userUid]);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getOperationsNoSync = async (): Promise<any[]> => {
  return [];
}

export default {
  getOperationsNoSync,
}
