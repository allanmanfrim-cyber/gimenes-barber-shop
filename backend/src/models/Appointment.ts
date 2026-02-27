import { DataTypes } from 'sequelize'
import { sequelize } from '../database/init.js'
import { ServiceModel } from './Service.js'

export const AppointmentModel = sequelize.define('Appointment', {
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  barber_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pendente_pagamento'
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reference_images: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

AppointmentModel.belongsTo(ServiceModel, {
  foreignKey: 'service_id'
})