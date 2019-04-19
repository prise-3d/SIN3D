'use strict'

import DataModel from '../models/Data'
import { dbLogger } from '../../../config'
import { formatLog } from '../../functions'

export default class Data {
  static async add(dataObj) {
    const doc = await DataModel.create({ data: dataObj })
    dbLogger.info(formatLog(`New document was added. id=${doc.id}`))
    return doc
  }

  static async del(dataId) {
    const doc = await DataModel.findByIdAndDelete(dataId)
    dbLogger.info(formatLog(`A document was deleted. id=${doc.id}`))
  }

  static async update(dataId, newDataObj) {
    const doc = await DataModel.findByIdAndUpdate(dataId, newDataObj, { new: true })
    dbLogger.info(formatLog(`A document was updated. id=${doc.id}`))
    return doc
  }

  static find(dataId) {
    return DataModel.findById(dataId)
  }
}
