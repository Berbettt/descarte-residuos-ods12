const API_URL = 'http://localhost:3000';

// --- Navegação entre Abas ---
function showSection(sectionId) {
  // Esconde todas as seções
  document.querySelectorAll('main section').forEach((sec) => {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });

  // Mostra a selecionada
  const selected = document.getElementById(sectionId);
  selected.style.display = 'block';
  selected.classList.add('active');

  // Se for a aba de descarte, carrega os pontos para o dropdown
  if (sectionId === 'section-descarte') {
    carregarPontosDropdown();
  }
  // Se for histórico, carrega a lista
  if (sectionId === 'section-historico') {
    carregarHistorico();
  }
  // Se for relatório, carrega os dados
  if (sectionId === 'section-relatorio') {
    carregarRelatorio();
  }
}

// --- 1. Cadastrar Ponto ---
async function cadastrarPonto(event) {
  event.preventDefault(); // Evita recarregar a página

  // Pega as categorias marcadas (checkboxes)
  const categorias = [];
  document.querySelectorAll('input[name="cat"]:checked').forEach((cb) => {
    categorias.push(cb.value);
  });

  const data = {
    name: document.getElementById('ponto-nome').value,
    neighborhood: document.getElementById('ponto-bairro').value,
    locationType: document.getElementById('ponto-tipo').value,
    acceptedCategories: categorias,
    geoLocation: {
      lat: parseFloat(document.getElementById('ponto-lat').value),
      lng: parseFloat(document.getElementById('ponto-lng').value),
    },
  };

  try {
    const response = await fetch(`${API_URL}/disposal-points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Ponto cadastrado com sucesso!');
      event.target.reset(); // Limpa o formulário
    } else {
      alert('Erro ao cadastrar ponto.');
    }
  } catch (error) {
    console.error(error);
    alert('Erro de conexão com a API.');
  }
}

// --- Auxiliar: Carregar Dropdown de Pontos ---
async function carregarPontosDropdown() {
  const select = document.getElementById('descarte-ponto-select');
  select.innerHTML = '<option>Carregando...</option>';

  try {
    const response = await fetch(`${API_URL}/disposal-points`);
    const pontos = await response.json();

    select.innerHTML = ''; // Limpa
    pontos.forEach((ponto) => {
      const option = document.createElement('option');
      option.value = ponto._id; // O ID do Mongo
      option.textContent = `${ponto.name} (${ponto.neighborhood})`;
      select.appendChild(option);
    });
  } catch (error) {
    select.innerHTML = '<option>Erro ao carregar</option>';
  }
}

// --- 2. Registrar Descarte ---
async function registrarDescarte(event) {
  event.preventDefault();

  const data = {
    userName: document.getElementById('descarte-usuario').value,
    disposalPointId: document.getElementById('descarte-ponto-select').value,
    wasteType: document.getElementById('descarte-tipo').value,
  };

  try {
    const response = await fetch(`${API_URL}/disposal-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Descarte registrado com sucesso!');
      event.target.reset();
    } else {
      const err = await response.json();
      alert('Erro: ' + (err.message || 'Desconhecido'));
    }
  } catch (error) {
    console.error(error);
    alert('Erro de conexão.');
  }
}

// --- 3. Histórico ---
async function carregarHistorico() {
  const divLista = document.getElementById('historico-lista');
  divLista.innerHTML = 'Carregando...';

  // Pega filtros
  const user = document.getElementById('filtro-usuario').value;
  const tipo = document.getElementById('filtro-tipo').value;

  // Monta URL com Query Params
  let url = `${API_URL}/disposal-records/history?`;
  if (user) url += `userName=${user}&`;
  if (tipo) url += `wasteType=${tipo}`;

  try {
    const response = await fetch(url);
    const registros = await response.json();

    divLista.innerHTML = '';

    if (registros.length === 0) {
      divLista.innerHTML = '<p>Nenhum registro encontrado.</p>';
      return;
    }

    registros.forEach((reg) => {
      const dataFormatada = new Date(reg.date).toLocaleDateString('pt-BR');
      const item = document.createElement('div');
      item.className = 'historico-item';
      item.innerHTML = `
                <strong>${dataFormatada}</strong> - 
                Usuário: <b>${reg.userName}</b> descartou 
                <i>${reg.wasteType}</i> em 
                <u>${reg.disposalPoint ? reg.disposalPoint.name : 'Ponto Desconhecido'}</u>
            `;
      divLista.appendChild(item);
    });
  } catch (error) {
    divLista.innerHTML = 'Erro ao carregar histórico.';
  }
}

// --- 4. Relatório (Dashboard) ---
async function carregarRelatorio() {
  try {
    const response = await fetch(`${API_URL}/relatorio`);
    const dados = await response.json();

    document.getElementById('dash-users').textContent = dados.totalUsers;
    document.getElementById('dash-points').textContent =
      dados.totalDisposalPoints;
    document.getElementById('dash-avg').textContent =
      dados.averageDailyDisposalsLast30Days;
    document.getElementById('dash-top-waste').textContent =
      dados.mostFrequentWasteType || 'N/A';
    document.getElementById('dash-top-point').textContent =
      dados.topDisposalPoint || 'N/A';

    const growthEl = document.getElementById('dash-growth');
    growthEl.textContent = dados.monthlyChangePercentage + '%';
    growthEl.style.color = dados.monthlyChangePercentage >= 0 ? 'green' : 'red';
  } catch (error) {
    console.error('Erro ao carregar relatório', error);
  }
}
