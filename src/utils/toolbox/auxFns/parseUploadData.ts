import { IProduct } from "@utils/@types/sqlite/product"
import { IValidation } from "@utils/@types/sqlite/validation"

export const parseUploadData = (data: {
  orders: any[]
  operations: any[]
  products: IProduct[]
  validations: IValidation[]
}) => {
  let validationsList: any[] = []

  data.validations.forEach((v) => {
    validationsList.push({
      id: v.uid,
    })
  })

  return {
    ...data,
    validations: validationsList,
  }
}
