import dbModelProductsList from "@services/sqlite/models/ProductsList"
import dbModelCombo from "@services/sqlite/models/Combo"
import { ICombo } from "@utils/@types/sqlite/combo"

export const getComboForProduct = async (productId: string) => {
  try {
    const listEntries = await dbModelProductsList.getListsByProductId(productId)
    if (!listEntries.length) return null

    const comboIds = [...new Set(listEntries.map(e => e.combo_id).filter(Boolean) as string[])]
    if (!comboIds.length) return null

    const combos = (await Promise.all(comboIds.map(id => dbModelCombo.getComboById(id)))).filter(Boolean) as ICombo[]
    if (!combos.length) return null

    const variasCombos = combos.filter(c => c.ticket_type === 'varias')
    const unicaCombos = combos.filter(c => c.ticket_type === 'unica')

    if (variasCombos.length > 0) {
      return { comboName: variasCombos[0].name, ticketType: 'varias' }
    }

    if (unicaCombos.length > 0) {
      return { comboName: unicaCombos[0].name, ticketType: 'unica' }
    }

    return null
  } catch (e) {
    return null
  }
}
