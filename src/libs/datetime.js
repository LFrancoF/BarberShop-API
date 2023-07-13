export const daTetimeSQL = (inputDate) => {
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
}

export const nowDateSQL = () => {
    //fecha actual
    const date = new Date()
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const fecha = `${y}-${m}-${d}`
    return fecha;
}

export const nowTimeSQL = () => {
    //fecha actual
    const date = new Date()
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    const hora = `${h}:${m}`
    return hora;
}