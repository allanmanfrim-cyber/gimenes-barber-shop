export function generatePixCode(amount: number, appointmentId: number): string {
  const pixKey = 'gimenes@barbershop.com'
  const merchantName = 'GIMENES BARBER SHOP'
  const city = 'SAO PAULO'
  const txId = `AGEND${appointmentId.toString().padStart(8, '0')}`
  
  const payload = [
    '000201',
    '010212',
    `26${(4 + pixKey.length + 22).toString().padStart(2, '0')}`,
    '0014BR.GOV.BCB.PIX',
    `01${pixKey.length.toString().padStart(2, '0')}${pixKey}`,
    '52040000',
    '5303986',
    `54${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}`,
    '5802BR',
    `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`,
    `60${city.length.toString().padStart(2, '0')}${city}`,
    `62${(4 + txId.length + 4).toString().padStart(2, '0')}`,
    `05${txId.length.toString().padStart(2, '0')}${txId}`,
    '6304'
  ].join('')

  const crc = calculateCRC16(payload)
  return payload + crc
}

function calculateCRC16(str: string): string {
  let crc = 0xFFFF
  const polynomial = 0x1021

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc <<= 1
      }
      crc &= 0xFFFF
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}
