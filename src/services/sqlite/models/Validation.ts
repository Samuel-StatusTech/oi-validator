import { IValidation } from "@utils/@types/sqlite/validation"
import db from "../Database"
import {
  insertValidation as insertValidationQuery,
  updateValidation as updateValidationQuery,
  updateValidations as updateValidationsQuery,
  selectValidationByUid,
  selectAllValidations,
  selectValidationsNoSync,
} from "../queries/validations"

const insertValidation = async (
  uid: string,
  user_id: string,
  synced: boolean,
  created_at: number,
  updated_at: number
) => {
  try {
    const result = await db.runAsync(insertValidationQuery, [
      uid,
      user_id,
      0,
      created_at,
      updated_at,
    ])
    if (result.changes > 0) return result.lastInsertRowId
    else throw new Error("Erro ao registrar validação")
  } catch (error) {
    throw error
  }
}

const updateValidation = async (
  ticketUid: string,
  synced: boolean
): Promise<IValidation[]> => {
  try {
    await db.runAsync(updateValidationQuery, [synced ? 1 : 0, ticketUid])
    return []
  } catch (error) {
    throw error
  }
}

const updateValidations = async (
  validationsUids: string[]
): Promise<boolean> => {
  try {
    await db.runAsync(updateValidationsQuery, [1, validationsUids.join(", ")])
    return true
  } catch (error) {
    throw error
  }
}

const searchByTicket = async (ticketUid: string): Promise<IValidation[]> => {
  try {
    const result = await db.getAllAsync<IValidation>(selectValidationByUid, [
      ticketUid,
    ])
    return result
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<IValidation[]> => {
  try {
    const result = await db.getAllAsync<IValidation>(selectAllValidations)
    return result
  } catch (error) {
    throw error
  }
}

const getValidationsNoSync = async (): Promise<IValidation[]> => {
  try {
    const result = await db.getAllAsync<IValidation>(selectValidationsNoSync)
    return result
  } catch (error) {
    throw error
  }
}

const Validation = {
  insertValidation,
  updateValidation,
  updateValidations,
  searchByTicket,
  getAll,
  getValidationsNoSync,
}

export default Validation
