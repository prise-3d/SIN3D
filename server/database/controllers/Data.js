'use strict'

import DataModel from '../models/Data'
import { dbLogger, TEST_MODE } from '../../../config'
import { formatLog } from '../../functions'

export default class Data {
  static get Model() {
    return DataModel
  }

  static log(data) {
    if (!TEST_MODE) dbLogger.info(formatLog(data))
  }

  static async add(dataObj) {
    const doc = await DataModel.create({ data: dataObj })
    this.log(`New document was added. id=${doc.id}`)
    return doc
  }

  static async del(dataId) {
    const doc = await DataModel.findByIdAndDelete(dataId)
    this.log(`A document was deleted. id=${doc.id}`)
  }

  static async update(dataId, newDataObj) {
    const doc = await DataModel.findByIdAndUpdate(dataId, { $set: { data: newDataObj } }, { new: true })
    this.log(`A document was updated. id=${doc.id}`)
    return doc
  }

  static find(dataId) {
    return DataModel.findById(dataId)
  }
}
