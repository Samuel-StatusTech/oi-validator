import { insertCombo, insertCombos } from "./operation_insert"
import { updateCombo, updateCombos } from "./operation_update"
import { getAllCombos, getComboById } from "./operation_search"

const dbModelCombo = {
  insertCombo,
  insertCombos,

  updateCombo,
  updateCombos,

  getAllCombos,
  getComboById,
}

export default dbModelCombo
