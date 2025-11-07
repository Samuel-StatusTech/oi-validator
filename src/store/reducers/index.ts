import { Setter } from "../../utils/@types/store"
import CommonReducer from "./Common"
import TokenReducer from "./Token"
import UserReducer from "./User"


const useReducers = (set: Setter) => {


  return ({
    User: UserReducer(set),
    Token: TokenReducer(set),
    Common: CommonReducer(set)
  })
}


export default useReducers