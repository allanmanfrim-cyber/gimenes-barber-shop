import { DataTypes } from 'sequelize'
import { sequelize } from '../database/init.js'
import { Service } from './Service.js'

export const Appointment = sequelize.define('Appointment', {
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

// Relacionamento
Appointment.belongsTo(Service, {
  foreignKey: 'service_id'
})