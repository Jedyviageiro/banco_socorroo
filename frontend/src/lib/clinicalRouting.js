export const DEPARTMENTS = [
  {
    key: 'laboratorio_principal',
    label: 'Laboratório Principal',
    summary: 'Encaminhar para exames laboratoriais e confirmação diagnóstica.',
  },
  {
    key: 'banco_de_sangue',
    label: 'Banco de Sangue',
    summary: 'Encaminhar para investigação de anemia, hemorragia ou suporte transfusional.',
  },
  {
    key: 'tarv',
    label: 'TARV',
    summary: 'Encaminhar para seguimento de VIH, TARV ou infeções oportunistas.',
  },
  {
    key: 'consulta_externa',
    label: 'Consulta Externa',
    summary: 'Encaminhar para cardiologia, Raio X ou avaliação clínica especializada.',
  },
  {
    key: 'estomatologia',
    label: 'Estomatologia',
    summary: 'Encaminhar para dor oral, lesões da boca, gengivas ou dentes.',
  },
  {
    key: 'dermatologia',
    label: 'Dermatologia',
    summary: 'Encaminhar para lesões cutâneas, comichão, manchas ou infeções da pele.',
  },
];

const DEPARTMENT_MAP = Object.fromEntries(DEPARTMENTS.map((item) => [item.key, item]));

const RULES = [
  {
    department: DEPARTMENT_MAP.banco_de_sangue,
    diagnoses: [
      'Suspeita de anemia sintomática',
      'Suspeita de hemorragia activa',
      'Necessidade de investigação hematológica',
    ],
    keywords: ['anemia', 'sangramento', 'hemorragia', 'palidez', 'sangue nas fezes', 'melena', 'hematemese', 'fraqueza intensa', 'transfusao', 'transfusão'],
    reason: 'Sintomas compatíveis com quadro hematológico ou necessidade de suporte do banco de sangue.',
  },
  {
    department: DEPARTMENT_MAP.tarv,
    diagnoses: [
      'Seguimento de TARV / VIH',
      'Suspeita de infeção oportunista',
      'Síndrome consumptiva em paciente crónico',
    ],
    keywords: ['vih', 'hiv', 'tarv', 'imunodeficiencia', 'imunodeficiência', 'tuberculose', 'tb', 'emagrecimento', 'sudorese nocturna', 'sudorese noturna', 'diarreia cronica', 'diarreia crónica'],
    reason: 'Queixas compatíveis com seguimento de TARV ou infeções oportunistas.',
  },
  {
    department: DEPARTMENT_MAP.estomatologia,
    diagnoses: [
      'Odontalgia / infeção dentária',
      'Gengivite ou lesão oral',
      'Processo inflamatório da cavidade oral',
    ],
    keywords: ['dor de dente', 'dente', 'gengiva', 'boca', 'afta', 'ulcera oral', 'úlcera oral', 'ferida na boca', 'halitose', 'lesao oral', 'lesão oral'],
    reason: 'Sintomas com predomínio oral, dentário ou gengival.',
  },
  {
    department: DEPARTMENT_MAP.dermatologia,
    diagnoses: [
      'Dermatite / erupção cutânea',
      'Suspeita de infeção cutânea',
      'Lesão dermatológica em investigação',
    ],
    keywords: ['pele', 'erupcao', 'erupção', 'rash', 'coceira', 'comichao', 'comichão', 'dermatite', 'manchas', 'prurido', 'lesao cutanea', 'lesão cutânea', 'ferida na pele'],
    reason: 'Queixas compatíveis com doença cutânea ou lesão dermatológica.',
  },
  {
    department: DEPARTMENT_MAP.consulta_externa,
    diagnoses: [
      'Queixa cardiorrespiratória em avaliação',
      'Necessidade de imagem / Raio X',
      'Observação especializada em consulta externa',
    ],
    keywords: ['tosse', 'falta de ar', 'dor no peito', 'palpitacoes', 'palpitações', 'cansaco', 'cansaço', 'fractura', 'fratura', 'raio x', 'rx', 'cardiologia', 'dispneia'],
    reason: 'Paciente pode necessitar de observação especializada, cardiologia ou Raio X.',
  },
  {
    department: DEPARTMENT_MAP.laboratorio_principal,
    diagnoses: [
      'Síndrome febril em investigação',
      'Suspeita de infeção sistémica',
      'Necessidade de confirmação laboratorial',
    ],
    keywords: ['febre', 'infeccao', 'infecção', 'vomitos', 'vómitos', 'diarreia', 'analises', 'análises', 'exame', 'hemograma', 'urina', 'mal estar', 'mal-estar'],
    reason: 'Há necessidade provável de confirmação laboratorial do quadro clínico.',
  },
];

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function deriveVitalAlerts({ temperatura, saturacaoOxigenio, frequenciaCardiaca, frequenciaRespiratoria, nivelDor, estadoGeral }) {
  const alerts = [];
  const priorities = [];

  if (temperatura !== null && temperatura >= 39) {
    alerts.push('febre alta');
    priorities.push('alta');
  } else if (temperatura !== null && temperatura >= 37.8) {
    alerts.push('febre');
    priorities.push('moderada');
  }

  if (saturacaoOxigenio !== null && saturacaoOxigenio < 92) {
    alerts.push('dessaturação');
    priorities.push('muito_alta');
  } else if (saturacaoOxigenio !== null && saturacaoOxigenio < 95) {
    alerts.push('saturação limítrofe');
    priorities.push('alta');
  }

  if (frequenciaCardiaca !== null && frequenciaCardiaca >= 130) {
    alerts.push('taquicardia importante');
    priorities.push('muito_alta');
  } else if (frequenciaCardiaca !== null && frequenciaCardiaca >= 110) {
    alerts.push('taquicardia');
    priorities.push('alta');
  }

  if (frequenciaRespiratoria !== null && frequenciaRespiratoria >= 32) {
    alerts.push('taquipneia importante');
    priorities.push('muito_alta');
  } else if (frequenciaRespiratoria !== null && frequenciaRespiratoria >= 24) {
    alerts.push('taquipneia');
    priorities.push('alta');
  }

  if (nivelDor !== null && nivelDor >= 8) {
    alerts.push('dor intensa');
    priorities.push('alta');
  }

  const normalizedState = normalizeText(estadoGeral);
  if (normalizedState === 'critico' || normalizedState === 'crítico') {
    alerts.push('estado geral crítico');
    priorities.push('muito_alta');
  } else if (normalizedState === 'debilitado') {
    alerts.push('estado geral debilitado');
    priorities.push('alta');
  }

  const priority = priorities.includes('muito_alta')
    ? 'muito_alta'
    : priorities.includes('alta')
      ? 'alta'
      : priorities.includes('moderada')
        ? 'moderada'
        : 'baixa';

  return { alerts, priority };
}

function getTopDiagnosis(rule, symptomsText) {
  const normalized = normalizeText(symptomsText);

  if (rule.department.key === 'dermatologia' && (normalized.includes('coceira') || normalized.includes('comichao'))) {
    return 'Dermatose pruriginosa em avaliação';
  }

  if (rule.department.key === 'estomatologia' && normalized.includes('dor de dente')) {
    return 'Odontalgia com provável foco dentário';
  }

  if (rule.department.key === 'consulta_externa' && (normalized.includes('dor no peito') || normalized.includes('palpitacoes'))) {
    return 'Queixa cardiorrespiratória com necessidade de avaliação especializada';
  }

  return rule.diagnoses[0];
}

export function getClinicalRouting(payload = {}) {
  const sintomas = payload.sintomas || payload.descricao || '';
  const normalizedSymptoms = normalizeText(sintomas);

  const vitals = {
    temperatura: parseNumber(payload.temperatura),
    saturacaoOxigenio: parseNumber(payload.saturacaoOxigenio),
    frequenciaCardiaca: parseNumber(payload.frequenciaCardiaca),
    frequenciaRespiratoria: parseNumber(payload.frequenciaRespiratoria),
    nivelDor: parseNumber(payload.nivelDor),
    estadoGeral: payload.estadoGeral || '',
  };

  const vitalAlerts = deriveVitalAlerts(vitals);

  const rankedRules = RULES
    .map((rule) => {
      const matchedKeywords = rule.keywords.filter((keyword) => normalizedSymptoms.includes(normalizeText(keyword)));
      let score = matchedKeywords.length;

      if (rule.department.key === 'consulta_externa' && vitalAlerts.alerts.some((item) => item.includes('taquipneia') || item.includes('dessaturação'))) {
        score += 2;
      }

      if (rule.department.key === 'laboratorio_principal' && vitalAlerts.alerts.some((item) => item.includes('febre'))) {
        score += 2;
      }

      if (rule.department.key === 'banco_de_sangue' && vitalAlerts.alerts.some((item) => item.includes('taquicardia'))) {
        score += 1;
      }

      return { ...rule, matchedKeywords, score };
    })
    .filter((rule) => rule.score > 0)
    .sort((a, b) => b.score - a.score);

  const selectedRule = rankedRules[0] || {
    ...RULES.find((rule) => rule.department.key === 'consulta_externa'),
    matchedKeywords: [],
    score: 0,
  };
  const confidence = selectedRule.score >= 3 ? 'alta' : selectedRule.score >= 2 ? 'moderada' : 'baixa';
  const diagnosis = getTopDiagnosis(selectedRule, sintomas);

  const finalPriority = vitalAlerts.priority === 'baixa'
    ? confidence === 'alta' ? 'moderada' : 'baixa'
    : vitalAlerts.priority;

  const reasonParts = [selectedRule.reason];

  if (vitalAlerts.alerts.length) {
    reasonParts.push(`Alertas de triagem: ${vitalAlerts.alerts.join(', ')}.`);
  }

  return {
    department: selectedRule.department,
    confidence,
    matchedKeywords: selectedRule.matchedKeywords || [],
    diagnosis,
    priority: finalPriority,
    alerts: vitalAlerts.alerts,
    reason: reasonParts.join(' '),
  };
}
