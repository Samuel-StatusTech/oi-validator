import { insertEvent, insertEvents } from "./operation_insert"
import { updateEvent, updateEvents } from "./operation_update"

const dbModelEvent = {
  insertEvent,
  insertEvents,

  updateEvent,
  updateEvents,
}

export default dbModelEvent
