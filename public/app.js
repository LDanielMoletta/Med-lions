const sections = document.querySelectorAll('.panel');
const menuButtons = document.querySelectorAll('.menu button');
const notification = document.getElementById('notification');

const states = {
  medicos: [],
  pacientes: [],
  consultas: []
};

const showNotification = (message, type = 'success') => {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  setTimeout(() => notification.classList.add('hidden'), 3500);
  notification.classList.remove('hidden');
};

const showSection = (sectionId) => {
  sections.forEach(section => section.classList.toggle('active', section.id === sectionId));
  menuButtons.forEach(button => button.classList.toggle('active', button.dataset.section === sectionId));
};

const api = {
  get: async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao carregar dados');
    return response.json();
  },
  post: async (url, body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || 'Erro ao salvar');
    return data;
  },
  delete: async (url) => {
    const response = await fetch(url, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || 'Erro ao excluir');
    return data;
  }
};

const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric'
});

const formatDateTime = (value) => new Date(value).toLocaleString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

const renderTable = (items, columns) => {
  if (!items.length) return '<p>Nenhum registro encontrado.</p>';
  const header = columns.map(column => `<th>${column.label}</th>`).join('');
  const rows = items.map(item => {
    const cells = columns.map(column => `<td>${column.render(item)}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="table"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
};

const renderMedicos = () => {
  document.getElementById('medico-list').innerHTML = renderTable(states.medicos, [
    { label: 'Nome', render: item => item.nome },
    { label: 'Especialidade', render: item => item.especialidade },
    { label: 'ID', render: item => item._id }
  ]);
};

const renderPacientes = () => {
  document.getElementById('paciente-list').innerHTML = renderTable(states.pacientes, [
    { label: 'Nome', render: item => item.nome },
    { label: 'Nascimento', render: item => formatDate(item.dataNascimento) },
    { label: 'ID', render: item => item._id }
  ]);
};

const renderConsultas = () => {
  document.getElementById('consulta-list').innerHTML = renderTable(states.consultas, [
    { label: 'Data/Hora', render: item => formatDateTime(item.dataHora) },
    { label: 'Médico', render: item => item.medico?.nome || '—' },
    { label: 'Paciente', render: item => item.paciente?.nome || '—' },
    { label: 'Motivo', render: item => item.motivo || 'Consulta de rotina' },
    { label: 'Ações', render: item => `<button class="btn-secondary" onclick="deleteConsulta('${item._id}')">Cancelar</button>` }
  ]);
};

window.deleteConsulta = async (id) => {
  try {
    await api.delete(`/api/consultas/${id}`);
    showNotification('Consulta cancelada com sucesso.');
    await loadConsultas();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const fillSelectOptions = () => {
  const medicoSelect = document.getElementById('consulta-medico');
  const pacienteSelect = document.getElementById('consulta-paciente');
  medicoSelect.innerHTML = states.medicos.map(m => `<option value="${m._id}">${m.nome} — ${m.especialidade}</option>`).join('');
  pacienteSelect.innerHTML = states.pacientes.map(p => `<option value="${p._id}">${p.nome} — ${formatDate(p.dataNascimento)}</option>`).join('');
};

const loadMedicos = async () => {
  states.medicos = await api.get('/api/medicos');
  renderMedicos();
  fillSelectOptions();
};

const loadPacientes = async () => {
  states.pacientes = await api.get('/api/pacientes');
  renderPacientes();
  fillSelectOptions();
};

const loadConsultas = async (query = '') => {
  let url = '/api/consultas';
  if (query) url += `?${query}`;
  states.consultas = await api.get(url);
  renderConsultas();
};

const loadAll = async () => {
  try {
    await Promise.all([loadMedicos(), loadPacientes()]);
    await loadConsultas();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const handleSubmit = (form, callback) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await callback();
      form.reset();
      await loadAll();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
};

const createMedico = async () => {
  const nome = document.getElementById('medico-nome').value.trim();
  const especialidade = document.getElementById('medico-especialidade').value.trim();
  await api.post('/api/medicos', { nome, especialidade });
  showNotification('Médico cadastrado com sucesso.');
};

const createPaciente = async () => {
  const nome = document.getElementById('paciente-nome').value.trim();
  const dataNascimento = document.getElementById('paciente-data').value;
  await api.post('/api/pacientes', { nome, dataNascimento });
  showNotification('Paciente cadastrado com sucesso.');
};

const createConsulta = async () => {
  const dataHora = document.getElementById('consulta-datahora').value;
  const medico = document.getElementById('consulta-medico').value;
  const paciente = document.getElementById('consulta-paciente').value;
  const motivo = document.getElementById('consulta-motivo').value.trim();
  await api.post('/api/consultas', { dataHora, medico, paciente, motivo });
  showNotification('Consulta agendada com sucesso.');
};

const initSearchButtons = () => {
  document.getElementById('medico-buscar').addEventListener('click', async () => {
    const query = document.getElementById('medico-busca').value.trim();
    if (!query) return loadMedicos();
    states.medicos = await api.get(`/api/medicos?nome=${encodeURIComponent(query)}&especialidade=${encodeURIComponent(query)}`);
    renderMedicos();
  });

  document.getElementById('paciente-buscar').addEventListener('click', async () => {
    const query = document.getElementById('paciente-busca').value.trim();
    if (!query) return loadPacientes();
    states.pacientes = await api.get(`/api/pacientes?nome=${encodeURIComponent(query)}`);
    renderPacientes();
  });

  document.getElementById('consulta-buscar').addEventListener('click', async () => {
    const query = document.getElementById('consulta-busca').value.trim();
    if (!query) return loadConsultas();
    const isDate = /^\d{4}-\d{2}(-\d{2})?$/.test(query);
    const param = isDate ? `data=${encodeURIComponent(query)}` : `descricao=${encodeURIComponent(query)}`;
    await loadConsultas(param);
  });
};

const initReports = () => {
  document.getElementById('relatorio-consultas-medico').addEventListener('click', async () => {
    const id = document.getElementById('relatorio-medico-id').value.trim();
    if (!id) return showNotification('Informe o ID do médico.', 'error');
    const data = await api.get(`/api/relatorios/consultas-medico/${id}`);
    document.getElementById('relatorio-list').innerHTML = renderTable(data, [
      { label: 'Data/Hora', render: item => formatDateTime(item.dataHora) },
      { label: 'Paciente', render: item => item.paciente?.nome || '—' },
      { label: 'Motivo', render: item => item.motivo || 'Consulta de rotina' }
    ]);
  });

  document.getElementById('relatorio-pacientes-por-medico').addEventListener('click', async () => {
    const id = document.getElementById('relatorio-pacientes-medico').value.trim();
    if (!id) return showNotification('Informe o ID do médico.', 'error');
    const data = await api.get(`/api/relatorios/pacientes-medico/${id}`);
    document.getElementById('relatorio-list').innerHTML = renderTable(data, [
      { label: 'Nome', render: item => item.nome },
      { label: 'Nascimento', render: item => formatDate(item.dataNascimento) },
      { label: 'ID', render: item => item._id }
    ]);
  });

  document.getElementById('relatorio-medicos-por-paciente').addEventListener('click', async () => {
    const id = document.getElementById('relatorio-medicos-paciente').value.trim();
    if (!id) return showNotification('Informe o ID do paciente.', 'error');
    const data = await api.get(`/api/relatorios/medicos-paciente/${id}`);
    document.getElementById('relatorio-list').innerHTML = renderTable(data, [
      { label: 'Nome', render: item => item.nome },
      { label: 'Especialidade', render: item => item.especialidade },
      { label: 'ID', render: item => item._id }
    ]);
  });

  document.getElementById('relatorio-consultas-mes').addEventListener('click', async () => {
    const mes = document.getElementById('relatorio-mes').value;
    if (!mes) return showNotification('Informe mês e ano.', 'error');
    const data = await api.get(`/api/relatorios/consultas-mes?mes=${mes}`);
    document.getElementById('relatorio-list').innerHTML = renderTable(data, [
      { label: 'Data/Hora', render: item => formatDateTime(item.dataHora) },
      { label: 'Médico', render: item => item.medico?.nome || '—' },
      { label: 'Paciente', render: item => item.paciente?.nome || '—' }
    ]);
  });
};

const bindMenu = () => {
  menuButtons.forEach(button => {
    button.addEventListener('click', () => showSection(button.dataset.section));
  });
};

const loginButton = document.getElementById('login-button');
const loginPanel = document.getElementById('login-panel');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const appContainer = document.querySelector('.container');

const login = async () => {
  const usuario = document.getElementById('login-usuario').value.trim();
  const senha = document.getElementById('login-senha').value;
  try {
    await api.post('/api/login', { usuario, senha });
    loginPanel.classList.remove('active');
    appContainer.classList.remove('hidden');
    showNotification('Login realizado com sucesso.');
    await loadAll();
  } catch (error) {
    loginMessage.textContent = error.message;
  }
};

const showLogin = () => {
  loginPanel.classList.add('active');
  appContainer.classList.add('hidden');
};

const init = async () => {
  bindMenu();
  loginButton.addEventListener('click', showLogin);
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';
    await login();
  });
  handleSubmit(document.getElementById('medico-form'), createMedico);
  handleSubmit(document.getElementById('paciente-form'), createPaciente);
  handleSubmit(document.getElementById('consulta-form'), createConsulta);
  initSearchButtons();
  initReports();
  // start hidden until login
  showLogin();
};

init().catch(error => showNotification(error.message, 'error'));
