document.getElementById('selectFile').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('convertButton').addEventListener('click', convertFile);

let contactListData = [];
let campaigns = [];

function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
}

function convertFile() {
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    processFile(file);
  } else {
    alert('Por favor, selecione um arquivo primeiro.');
  }
}

function processFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    contactListData = json;
    displayData(json);
  };
  reader.readAsArrayBuffer(file);
}

function displayData(data) {
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = '';
  data.forEach(contact => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${contact.Nome}</td>
      <td>${contact.Telefone}</td>
    `;
    contactList.appendChild(row);
  });
  $('#dataModal').modal('show');
}

document.getElementById('sendButton').addEventListener('click', function() {
  sendCampaign();
});

async function sendCampaign() {
  console.log('contactListData', contactListData);

  const campaignTitle = "inss_facta"; 
  const sendStatus = await fetch('/send-campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: campaignTitle,
      contacts: contactListData,
      type: campaignTitle
    }),
  })

  const statusJson = await sendStatus.json();

  console.log('statusJson', statusJson);

  if(statusJson.status == "Enviado"){
    campaigns.push(statusJson);
    updateCampaignList();
    $('#dataModal').modal('hide');
    alert('Campanha enviada com sucesso!');
  }

  // .then(response => response.json())
  // .then(campaign => {
  //   campaigns.push(campaign);
  //   updateCampaignList();
  //   $('#dataModal').modal('hide');
  //   alert('Campanha enviada com sucesso!');
  // })
  // .catch(error => {
  //   console.error('Erro ao enviar a campanha:', error);
  // });

}

function updateCampaignList() {
  const campaignList = document.getElementById('campaignList');
  campaignList.innerHTML = '';
  campaigns.forEach(campaign => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${campaign.title}</td>
      <td>${campaign.contactsSent}</td>
      <td>${campaign.status}</td>
      <td>${campaign.createdAt}</td>
    `;
    campaignList.appendChild(row);
  });
}