import db from "../Database"
import { selectAllUsers, selectUserOperators, selectUserValidators, selectWaiterByCode } from "../queries/users"

export const getUsers = async () => {
  try {
    const list = await db.getAllAsync<any>(selectAllUsers);
    const userOperators = await getUserOperators() as any[]   // todo: type
    for (const key in list) {
      const config = userOperators.find((e) => e.user_id == list[key].uid)
      list[key]["config"] = config && config._raw ? config._raw : {}
    }
    return list;
  } catch (error) {
    throw error;
  }
}

export const getUserOperators = async () => {
  try {
    const result = await db.getAllAsync(selectUserOperators);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getUserValidators = async () => {
  try {
    const result = await db.getAllAsync(selectUserValidators);
    return result;
  } catch (error) {
    throw error;
  }
}

export const getWaiterByCode = async (code: string) => {
  try {
    const result = await db.getAllAsync(selectWaiterByCode, [code]);
    if (result.length > 0) return result[0];
    else return undefined;
  } catch (error) {
    throw error;
  }
}

export default {
  getUsers,
  getUserOperators,
  getUserValidators,
  getWaiterByCode,
}
