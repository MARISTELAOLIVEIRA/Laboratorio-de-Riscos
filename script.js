const scenarioBank = {
  compare: [
    {
      a: {
        title: "Cenário A",
        text: "Durante a Black Friday, o gateway de pagamento fica indisponível por 2 horas. A venda online para quase completamente.",
        asset: "Gateway de pagamento",
        threat: "Indisponibilidade",
        probability: "Alta",
        impact: "Alto"
      },
      b: {
        title: "Cenário B",
        text: "Um colaborador interno acessa sem autorização um relatório histórico de marketing, sem alteração dos dados.",
        asset: "Relatórios internos",
        threat: "Acesso indevido",
        probability: "Média",
        impact: "Médio"
      },
      answer: "A",
      why: "O Cenário A afeta diretamente a geração de receita em momento crítico do negócio."
    },
    {
      a: {
        title: "Cenário A",
        text: "O banco de dados de clientes pode vazar por causa de senhas fracas e ausência de MFA.",
        asset: "Banco de dados de clientes",
        threat: "Vazamento de dados",
        probability: "Alta",
        impact: "Alto"
      },
      b: {
        title: "Cenário B",
        text: "Uma impressora do setor administrativo fica indisponível por 1 dia.",
        asset: "Impressora administrativa",
        threat: "Falha de equipamento",
        probability: "Média",
        impact: "Baixo"
      },
      answer: "A",
      why: "O Cenário A reúne alta probabilidade e alto impacto legal, reputacional e operacional."
    }
  ],
  inventory: [
    {
      business: "A LojaTech depende de vendas online, processamento de pagamento e suporte pós-venda.",
      assets: [
        "Banco de dados de clientes",
        "Gateway de pagamento",
        "Sistema de vendas online",
        "Servidor de e-mail",
        "Backup offline"
      ],
      critical: ["Banco de dados de clientes", "Gateway de pagamento", "Sistema de vendas online"]
    },
    {
      business: "A LojaTech precisa manter vendas, faturamento e relacionamento com clientes sem interrupções prolongadas.",
      assets: [
        "ERP / sistema financeiro",
        "Rede corporativa",
        "Sistema de vendas online",
        "Equipe de atendimento",
        "Dispositivos móveis corporativos"
      ],
      critical: ["ERP / sistema financeiro", "Sistema de vendas online", "Rede corporativa"]
    }
  ],
  riskBuilder: [
    {
      asset: "Banco de dados de clientes",
      threats: ["Vazamento de dados", "Ransomware", "Erro humano"],
      vulnerabilities: ["Senhas fracas", "Falta de MFA", "Backup inadequado"]
    },
    {
      asset: "Sistema de vendas online",
      threats: ["DDoS", "Falha de sistema", "Erro de configuração"],
      vulnerabilities: ["Ausência de monitoramento", "Infraestrutura sem redundância", "Software desatualizado"]
    },
    {
      asset: "ERP / sistema financeiro",
      threats: ["Acesso indevido", "Fraude interna", "Falha de hardware"],
      vulnerabilities: ["Controle de acesso inadequado", "Ausência de segregação de funções", "Sem plano de contingência"]
    }
  ],
  continuity: [
    {
      incident: "Um ransomware criptografou o servidor principal e o sistema de vendas ficou indisponível.",
      hint: "O negócio precisa continuar e a infraestrutura precisa ser recuperada."
    },
    {
      incident: "Uma falha elétrica derrubou o datacenter local e afetou e-mail, ERP e vendas online.",
      hint: "Pense em continuidade operacional e recuperação técnica."
    }
  ],
  prioritization: [
    {
      risks: [
        { text: "Ransomware no servidor de vendas", level: "Crítico" },
        { text: "Phishing em caixa de e-mail genérica", level: "Alto" },
        { text: "Falha eventual em impressora administrativa", level: "Baixo" }
      ],
      answer: 0,
      why: "O servidor de vendas impacta diretamente receita, operação e atendimento."
    },
    {
      risks: [
        { text: "Vazamento do banco de dados de clientes", level: "Crítico" },
        { text: "Erro de formatação em relatório interno", level: "Médio" },
        { text: "Instabilidade em monitor secundário", level: "Baixo" }
      ],
      answer: 0,
      why: "O vazamento afeta aspectos legais, reputacionais e operacionais."
    }
  ]
};

let student = "";
let mission = 1;
let score = 0;
let timerSeconds = 0;
let timerRef = null;
let currentPayload = {};
let studentAnswers = [];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateTopbar() {
  document.getElementById("missionNum").textContent = mission;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = formatTime(timerSeconds);
}

function formatTime(sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function startTimer() {
  if (timerRef) clearInterval(timerRef);
  timerRef = setInterval(() => {
    timerSeconds += 1;
    updateTopbar();
  }, 1000);
}

function logMessage(msg) {
  const box = document.getElementById("logBox");
  box.textContent += `${msg}\n`;
}

function showScreen(idToShow) {
  ["introScreen", "missionScreen", "finalScreen"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(idToShow).classList.remove("hidden");
}

function setFeedback(text, ok) {
  const fb = document.getElementById("feedback");
  fb.className = `feedback ${ok ? "ok" : "bad"}`;
  fb.textContent = text;
  fb.classList.remove("hidden");
}

function clearFeedback() {
  const fb = document.getElementById("feedback");
  fb.classList.add("hidden");
  fb.textContent = "";
}

function renderMission() {
  clearFeedback();
  showScreen("missionScreen");
  updateTopbar();

  const title = document.getElementById("missionTitle");
  const desc = document.getElementById("missionDesc");
  const content = document.getElementById("missionContent");

  if (mission === 1) {
    const data = rand(scenarioBank.inventory);
    currentPayload = data;
    title.textContent = "Missão 1 — Entender o negócio e identificar ativos críticos";
    desc.textContent = "Leia o contexto e selecione os 3 ativos mais críticos para a continuidade do negócio.";
    content.innerHTML = `
      <div class="highlight"><strong>Contexto:</strong> ${data.business}</div>
      <div class="option-group">
        ${data.assets.map(asset => `<label class="option"><input type="checkbox" name="criticalAsset" value="${asset}"> ${asset}</label>`).join("")}
      </div>
      <p class="small">Escolha exatamente 3 ativos.</p>
      <div class="progress"><div class="progress-bar" style="width:20%"></div></div>
    `;
  }

  if (mission === 2) {
    const data = rand(scenarioBank.compare);
    currentPayload = data;
    title.textContent = "Missão 2 — Comparar cenários e priorizar o risco";
    desc.textContent = "Compare os dois cenários e escolha qual deve ser tratado primeiro pela gestão.";
    content.innerHTML = `
      <div class="compare-grid">
        <div class="scenario-box">
          <h3>${data.a.title}</h3>
          <p>${data.a.text}</p>
          <table class="table-sim">
            <tr><th>Ativo</th><td>${data.a.asset}</td></tr>
            <tr><th>Ameaça</th><td>${data.a.threat}</td></tr>
            <tr><th>Probabilidade</th><td>${data.a.probability}</td></tr>
            <tr><th>Impacto</th><td>${data.a.impact}</td></tr>
          </table>
        </div>
        <div class="scenario-box">
          <h3>${data.b.title}</h3>
          <p>${data.b.text}</p>
          <table class="table-sim">
            <tr><th>Ativo</th><td>${data.b.asset}</td></tr>
            <tr><th>Ameaça</th><td>${data.b.threat}</td></tr>
            <tr><th>Probabilidade</th><td>${data.b.probability}</td></tr>
            <tr><th>Impacto</th><td>${data.b.impact}</td></tr>
          </table>
        </div>
      </div>
      <label>Qual cenário deve ser tratado primeiro?</label>
      <div class="option-group">
        <label class="option"><input type="radio" name="scenarioChoice" value="A"> Cenário A</label>
        <label class="option"><input type="radio" name="scenarioChoice" value="B"> Cenário B</label>
      </div>
      <label>Justifique sua escolha</label>
      <textarea id="justification" placeholder="Explique com base em impacto, probabilidade, criticidade do ativo e negócio."></textarea>
      <div class="progress"><div class="progress-bar" style="width:40%"></div></div>
    `;
  }

  if (mission === 3) {
    const data = rand(scenarioBank.riskBuilder);
    currentPayload = data;
    title.textContent = "Missão 3 — Construir uma análise de risco";
    desc.textContent = "Monte um risco coerente usando ativo, ameaça, vulnerabilidade, probabilidade e impacto.";
    content.innerHTML = `
      <label>Ativo</label>
      <select id="assetSel">${scenarioBank.riskBuilder.map(item => `<option value="${item.asset}">${item.asset}</option>`).join("")}</select>
      <label>Ameaça</label>
      <select id="threatSel"></select>
      <label>Vulnerabilidade</label>
      <select id="vulnSel"></select>
      <label>Probabilidade</label>
      <select id="probSel"><option value="1">Baixa</option><option value="2">Média</option><option value="3">Alta</option></select>
      <label>Impacto</label>
      <select id="impactSel"><option value="1">Baixo</option><option value="2">Médio</option><option value="3">Alto</option></select>
      <label>Medida inicial de mitigação</label>
      <textarea id="mitigation" placeholder="Ex.: MFA, backup testado, redundância, treinamento, segmentação de rede..."></textarea>
      <div id="riskPreview" class="small">Monte o risco e envie sua análise.</div>
      <div class="progress"><div class="progress-bar" style="width:60%"></div></div>
    `;
    document.getElementById("assetSel").addEventListener("change", syncRiskOptions);
    syncRiskOptions();
  }

  if (mission === 4) {
    const data = rand(scenarioBank.continuity);
    currentPayload = data;
    title.textContent = "Missão 4 — Continuidade de negócios (BCP/DRP)";
    desc.textContent = "Diante do incidente, decida o que a empresa precisa acionar para continuar operando.";
    content.innerHTML = `
      <div class="highlight"><strong>Incidente:</strong> ${data.incident}</div>
      <div class="small">${data.hint}</div>
      <label>Qual plano é necessário?</label>
      <div class="option-group">
        <label class="option"><input type="checkbox" name="continuity" value="BCP"> BCP</label>
        <label class="option"><input type="checkbox" name="continuity" value="DRP"> DRP</label>
      </div>
      <label>Escolha a primeira ação prioritária</label>
      <div class="option-group">
        <label class="option"><input type="radio" name="firstAction" value="Acionar backup íntegro"> Acionar backup íntegro</label>
        <label class="option"><input type="radio" name="firstAction" value="Trocar as cadeiras do setor"> Trocar as cadeiras do setor</label>
        <label class="option"><input type="radio" name="firstAction" value="Suspender a segurança"> Suspender a segurança</label>
        <label class="option"><input type="radio" name="firstAction" value="Ativar contingência"> Ativar contingência</label>
      </div>
      <label>Explique por que sua decisão ajuda a continuidade do negócio</label>
      <textarea id="continuityWhy" placeholder="Explique a diferença entre manter o negócio operando e recuperar a infraestrutura."></textarea>
      <div class="progress"><div class="progress-bar" style="width:80%"></div></div>
    `;
  }

  if (mission === 5) {
    const data = rand(scenarioBank.prioritization);
    currentPayload = data;
    title.textContent = "Missão 5 — Priorização final do analista";
    desc.textContent = "Escolha qual risco deve ser tratado primeiro e defenda sua decisão como analista.";
    content.innerHTML = `
      <table class="table-sim">
        <tr><th>Risco</th><th>Nível</th></tr>
        ${data.risks.map(r => `<tr><td>${r.text}</td><td>${r.level}</td></tr>`).join("")}
      </table>
      <label>Qual risco deve ser tratado primeiro?</label>
      <div class="option-group">
        ${data.risks.map((r, idx) => `<label class="option"><input type="radio" name="priorityRisk" value="${idx}"> ${r.text}</label>`).join("")}
      </div>
      <label>Qual medida você implementaria primeiro?</label>
      <textarea id="finalAction" placeholder="Explique sua decisão com foco em negócio, risco e continuidade."></textarea>
      <div class="progress"><div class="progress-bar" style="width:100%"></div></div>
    `;
  }
}

function syncRiskOptions() {
  const selectedAsset = document.getElementById("assetSel").value;
  const found = scenarioBank.riskBuilder.find(x => x.asset === selectedAsset);
  document.getElementById("threatSel").innerHTML = found.threats.map(t => `<option>${t}</option>`).join("");
  document.getElementById("vulnSel").innerHTML = found.vulnerabilities.map(v => `<option>${v}</option>`).join("");
}

function gradeMission() {
  if (mission === 1) {
    const chosen = [...document.querySelectorAll('input[name="criticalAsset"]:checked')].map(x => x.value);
    if (chosen.length !== 3) return { ok: false, msg: "Escolha exatamente 3 ativos críticos." };
    const hits = chosen.filter(c => currentPayload.critical.includes(c)).length;
    const pts = hits * 5;
    score += pts;
    studentAnswers.push({
      mission: 1,
      title: "Identificação de ativos críticos",
      answer: `Ativos escolhidos: ${chosen.join(", ")}`
    });
    return { ok: true, msg: `Você acertou ${hits}/3 ativos críticos. +${pts} pontos.` };
  }

  if (mission === 2) {
    const selected = document.querySelector('input[name="scenarioChoice"]:checked');
    const justification = document.getElementById("justification").value.trim();
    if (!selected || justification.length < 35) return { ok: false, msg: "Escolha um cenário e justifique com mais detalhes." };
    const correct = selected.value === currentPayload.answer;
    const pts = correct ? 20 : 8;
    score += pts;
    studentAnswers.push({
      mission: 2,
      title: "Comparação de cenários de risco",
      answer: `Cenário escolhido: ${selected.value}\nJustificativa: ${justification}`
    });
    return { ok: true, msg: `${correct ? "Boa priorização." : "Sua priorização não foi a ideal, mas a justificativa conta."} ${currentPayload.why} +${pts} pontos.` };
  }

  if (mission === 3) {
    const asset = document.getElementById("assetSel").value;
    const threat = document.getElementById("threatSel").value;
    const vuln = document.getElementById("vulnSel").value;
    const prob = parseInt(document.getElementById("probSel").value, 10);
    const impact = parseInt(document.getElementById("impactSel").value, 10);
    const mitigation = document.getElementById("mitigation").value.trim();
    if (mitigation.length < 20) return { ok: false, msg: "Descreva uma mitigação mais consistente." };
    const risk = prob * impact;
    let level = "Baixo";
    if (risk >= 3) level = "Médio";
    if (risk >= 6) level = "Alto";
    if (risk >= 8) level = "Crítico";
    const pts = risk >= 6 ? 22 : 16;
    score += pts;
    document.getElementById("riskPreview").innerHTML = `<strong>Risco calculado:</strong> ${level} (score ${risk})<br><strong>Ativo:</strong> ${asset}<br><strong>Ameaça:</strong> ${threat}<br><strong>Vulnerabilidade:</strong> ${vuln}`;
    studentAnswers.push({
      mission: 3,
      title: "Construção de análise de risco",
      answer: `Ativo: ${asset}\nAmeaça: ${threat}\nVulnerabilidade: ${vuln}\nNível de risco: ${level}\nMedida de mitigação: ${mitigation}`
    });
    return { ok: true, msg: `Análise registrada com risco ${level}. +${pts} pontos.` };
  }

  if (mission === 4) {
    const plans = [...document.querySelectorAll('input[name="continuity"]:checked')].map(x => x.value);
    const action = document.querySelector('input[name="firstAction"]:checked');
    const why = document.getElementById("continuityWhy").value.trim();
    if (plans.length === 0 || !action || why.length < 35) return { ok: false, msg: "Complete a análise de BCP/DRP e explique melhor sua decisão." };
    const hasBCP = plans.includes("BCP");
    const hasDRP = plans.includes("DRP");
    const goodAction = ["Acionar backup íntegro", "Ativar contingência"].includes(action.value);
    const pts = (hasBCP && hasDRP && goodAction) ? 20 : 10;
    score += pts;
    studentAnswers.push({
      mission: 4,
      title: "Continuidade de negócios (BCP/DRP)",
      answer: `Planos escolhidos: ${plans.join(", ")}\nPrimeira ação: ${action.value}\nExplicação: ${why}`
    });
    return { ok: true, msg: `${hasBCP && hasDRP ? "Boa leitura: continuidade e recuperação são necessárias." : "Considere que o incidente exige continuidade e recuperação técnica."} +${pts} pontos.` };
  }

  if (mission === 5) {
    const selected = document.querySelector('input[name="priorityRisk"]:checked');
    const finalAction = document.getElementById("finalAction").value.trim();
    if (!selected || finalAction.length < 35) return { ok: false, msg: "Escolha um risco prioritário e justifique melhor a ação." };
    const correct = parseInt(selected.value, 10) === currentPayload.answer;
    const pts = correct ? 18 : 8;
    score += pts;
    const chosenRisk = currentPayload.risks[parseInt(selected.value, 10)];
    studentAnswers.push({
      mission: 5,
      title: "Priorização final de riscos",
      answer: `Risco escolhido: ${chosenRisk.text}\nMedida implementada: ${finalAction}`
    });
    return { ok: true, msg: `${correct ? "Priorização coerente com o negócio." : "A justificativa tem valor, mas a prioridade ideal era outra."} ${currentPayload.why} +${pts} pontos.` };
  }

  return { ok: false, msg: "Missão inválida." };
}

function finishGame() {
  clearInterval(timerRef);
  showScreen("finalScreen");
  updateTopbar();
  let rank = "Analista Iniciante";
  if (score >= 50) rank = "Analista Júnior";
  if (score >= 75) rank = "Analista Pleno";
  if (score >= 95) rank = "Analista Sênior";
  document.getElementById("finalSummary").innerHTML = `<strong>Aluno:</strong> ${student}<br><strong>Pontuação final:</strong> ${score}<br><strong>Classificação:</strong> ${rank}<br><strong>Tempo de execução:</strong> ${formatTime(timerSeconds)}<br><br><strong>Leitura pedagógica:</strong> você trabalhou identificação de ativos, comparação de riscos, análise de impacto, continuidade de negócios e priorização de tratamento.`;
  logMessage(`🏁 Conclusão: ${student} finalizou com ${score} pontos (${rank}).`);
}

document.getElementById("startBtn").addEventListener("click", () => {
  const name = document.getElementById("studentName").value.trim();
  if (!name) {
    alert("Digite seu nome para iniciar.");
    return;
  }
  student = name;
  score = 0;
  mission = 1;
  timerSeconds = 0;
  studentAnswers = [];
  document.getElementById("logBox").textContent = `▶️ Início da missão: ${student}\n`;
  startTimer();
  renderMission();
});

document.getElementById("submitBtn").addEventListener("click", () => {
  const result = gradeMission();
  if (!result.ok) {
    setFeedback(result.msg, false);
    return;
  }
  setFeedback(result.msg, true);
  logMessage(`Missão ${mission}: ${result.msg}`);
  updateTopbar();
  setTimeout(() => {
    mission += 1;
    if (mission > 5) finishGame();
    else renderMission();
  }, 1400);
});

document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  generatePDF();
});

function generatePDF() {
  let rank = "Analista Iniciante";
  if (score >= 50) rank = "Analista Júnior";
  if (score >= 75) rank = "Analista Pleno";
  if (score >= 95) rank = "Analista Sênior";

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  const pdfContent = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #22c55e; padding-bottom: 20px;">
        <h1 style="color: #0b1220; margin: 0; font-size: 28px;">🛡️ LojaTech</h1>
        <h2 style="color: #374151; margin: 10px 0; font-size: 20px;">Laboratório Avançado de Riscos</h2>
        <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Certificado de Conclusão</p>
      </div>

      <div style="margin: 30px 0; padding: 25px; background: #f3f4f6; border-radius: 12px; border-left: 5px solid #22c55e;">
        <h3 style="color: #0b1220; margin-top: 0; font-size: 18px;">Certificamos que</h3>
        <p style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 15px 0;">${student}</p>
        <p style="color: #4b5563; font-size: 14px; margin: 0;">concluiu com êxito as 5 missões do Laboratório Avançado de Riscos, demonstrando competências em:</p>
      </div>

      <div style="margin: 25px 0; padding: 20px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px;">
        <ul style="list-style: none; padding: 0; margin: 0; color: #374151;">
          <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">✓ Identificação e priorização de ativos críticos</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">✓ Análise comparativa de cenários de risco</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">✓ Construção de análise de risco (ativo, ameaça, vulnerabilidade)</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">✓ Planejamento de continuidade de negócios (BCP/DRP)</li>
          <li style="padding: 8px 0;">✓ Priorização e gestão de múltiplos riscos</li>
        </ul>
      </div>

      <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div style="padding: 15px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
          <p style="margin: 0; color: #065f46; font-size: 12px; font-weight: bold;">PONTUAÇÃO FINAL</p>
          <p style="margin: 8px 0 0 0; color: #047857; font-size: 28px; font-weight: bold;">${score} <span style="font-size: 14px;">pontos</span></p>
        </div>
        <div style="padding: 15px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
          <p style="margin: 0; color: #1e40af; font-size: 12px; font-weight: bold;">CLASSIFICAÇÃO</p>
          <p style="margin: 8px 0 0 0; color: #1d4ed8; font-size: 18px; font-weight: bold;">${rank}</p>
        </div>
      </div>

      <div style="margin: 25px 0; padding: 15px; background: #fafafa; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 13px;">⏱️ Tempo de execução: <strong>${formatTime(timerSeconds)}</strong></p>
        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px;">📅 Data de conclusão: <strong>${dateStr}</strong></p>
      </div>

      <div style="margin: 35px 0; page-break-before: always;">
        <h3 style="color: #0b1220; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">📝 Histórico de Respostas</h3>
        ${studentAnswers.map((item, idx) => `
          <div style="margin: 20px 0; padding: 18px; background: ${idx % 2 === 0 ? '#f9fafb' : '#ffffff'}; border-left: 4px solid #3b82f6; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold; font-size: 14px;">Missão ${item.mission} — ${item.title}</p>
            <p style="margin: 0; color: #4b5563; font-size: 13px; white-space: pre-line; line-height: 1.6;">${item.answer}</p>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">Este certificado atesta a conclusão do laboratório prático de análise de riscos e continuidade de negócios.</p>
        <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">LojaTech – Laboratório Avançado de Riscos © ${today.getFullYear()}</p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = pdfContent;
  document.body.appendChild(element);

  const opt = {
    margin: 10,
    filename: `LojaTech_Certificado_${student.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    document.body.removeChild(element);
  });
}
