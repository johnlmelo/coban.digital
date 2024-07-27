function limparString(input) {
    // Remove tudo que não é dígito
    return input.replace(/\D/g, '');
}

function transformDateTime(dateTimeStr) {
    // Extrair a data e a hora da string
    const [date, time] = dateTimeStr.split(' ');
    const [day, month, year] = date.split('/').map(Number);
    const [hour, minute, second] = time.split(':').map(Number);
  
    // Criar um objeto Date com a data e a hora fornecidas
    const dateObj = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  
    // Adicionar 3 horas para ajustar de BRT para UTC
    dateObj.setUTCHours(dateObj.getUTCHours() + 3);
  
    // Formatar a data e a hora no formato ISO 8601
    const isoString = dateObj.toISOString();
  
    // Remover a parte de milissegundos
    return isoString.split('.')[0];
}


function formatDate(dateStr) {
    let parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
    if (parts[2].length === 4) {
        var data = `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else {
        var data =  `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    return data;
  }

module.exports = {
    limparString,
    transformDateTime,
    formatDate
}