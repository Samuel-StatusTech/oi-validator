import { insertCombo, insertCombos } from "./operation_insert"
import { updateCombo, updateCombos } from "./operation_update"
import { getAllCombos } from "./operation_search"

const dbModelCombo = {
  insertCombo,
  insertCombos,

  updateCombo,
  updateCombos,

  getAllCombos,
}

export default dbModelCombo
