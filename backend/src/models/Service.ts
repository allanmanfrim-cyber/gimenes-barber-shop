import { db } from '../database/init.js'

export const ServiceModel = {

  findById(id: number) {
    return db
      .prepare('SELECT * FROM services WHERE id = ? AND active = 1')
      .get(id)
  },

  findAll() {
    return db
      .prepare('SELECT * FROM services WHERE active = 1')
      .all()
  }

}