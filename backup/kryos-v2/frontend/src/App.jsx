import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

const themeOptions = {
  clean: {
    label: 'Clean',
    description: 'Tema claro para operação diária.',
  },
  night: {
    label: 'Night',
    description: 'Ideal para NOC com baixa luminosidade.',
  },
  highContrast: {
    label: 'High Contrast',
    description: 'Contraste máximo para ambientes industriais.',
  },
};

const componentImages = [
  { key: 'pj', name: 'PJ', path: '/images/PJ.png', note: 'Painel elétrico geral.', orientation: 'landscape' },
  { key: 'prack', name: 'pRACK', path: '/images/pRACK.png', note: 'Rack de compressão.', orientation: 'ultrawide' },
  { key: 'mpx-pro', name: 'MPX PRO', path: '/images/MPX.png', note: 'Controlador MPX PRO.', orientation: 'portrait' },
  { key: 'pco', name: 'pCO', path: '/images/pCO.png', note: 'Controlador pCO série completa.', orientation: 'ultrawide' },
  { key: 'pco-mini', name: 'pCO mini', path: '/images/pCOmini.png', note: 'Versão compacta pCO mini.', orientation: 'portrait' },
];

const fallbackPlants = [];
const fallbackDevices = {};
const fallbackAlarms = {};
const backendSnapshotStorageKey = 'kryos.backend.snapshot.v1';

const hasAnyBackendData = (plants, devices, alarms) => {
  const hasPlants = Array.isArray(plants) && plants.length > 0;
  const hasDevices = Object.values(devices || {}).some((rows) => Array.isArray(rows) && rows.length > 0);
  const hasAlarms = Object.values(alarms || {}).some((rows) => Array.isArray(rows) && rows.length > 0);
  return hasPlants || hasDevices || hasAlarms;
};

const loadBackendSnapshot = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(backendSnapshotStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const plants = Array.isArray(parsed.plants) ? parsed.plants : fallbackPlants;
    const devices = parsed.devices && typeof parsed.devices === 'object' ? parsed.devices : fallbackDevices;
    const alarms = parsed.alarms && typeof parsed.alarms === 'object' ? parsed.alarms : fallbackAlarms;
    const updatedAt = Number(parsed.updatedAt);
    return {
      plants,
      devices,
      alarms,
      updatedAt: Number.isFinite(updatedAt) ? updatedAt : null,
    };
  } catch (_err) {
    return null;
  }
};

const persistBackendSnapshot = (snapshot) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(backendSnapshotStorageKey, JSON.stringify(snapshot));
  } catch (_err) {
    // ignore storage issues
  }
};

const getTextByteLength = (value) => {
  if (value === null || value === undefined) return 0;
  const text = String(value);
  if (!text.length) return 0;
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(text).length;
  }
  return text.length;
};

const estimatePayloadBytes = (payload) => {
  if (payload === null || payload === undefined) return 0;
  if (typeof payload === 'string') return getTextByteLength(payload);
  if (typeof URLSearchParams !== 'undefined' && payload instanceof URLSearchParams) {
    return getTextByteLength(payload.toString());
  }
  if (typeof Blob !== 'undefined' && payload instanceof Blob) {
    return Number(payload.size) || 0;
  }
  if (typeof ArrayBuffer !== 'undefined' && payload instanceof ArrayBuffer) {
    return Number(payload.byteLength) || 0;
  }
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(payload)) {
    return Number(payload.byteLength) || 0;
  }
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    let total = 0;
    payload.forEach((value, key) => {
      total += getTextByteLength(key) + 2;
      if (typeof value === 'string') {
        total += getTextByteLength(value);
      } else if (typeof Blob !== 'undefined' && value instanceof Blob) {
        total += Number(value.size) || 0;
      } else {
        total += getTextByteLength(String(value));
      }
    });
    return total;
  }
  if (typeof payload === 'object') {
    try {
      return getTextByteLength(JSON.stringify(payload));
    } catch (_err) {
      return 0;
    }
  }
  return getTextByteLength(payload);
};

async function fetchJson(url, options = {}, requestConfig = {}) {
  const timeoutMs = Number(requestConfig?.timeoutMs);
  const shouldUseTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0;
  const timerApi = typeof window !== 'undefined' ? window : globalThis;
  const controller = shouldUseTimeout && typeof AbortController !== 'undefined'
    ? new AbortController()
    : null;
  const finalOptions = controller ? { ...options, signal: controller.signal } : options;
  const requestBytes = estimatePayloadBytes(finalOptions?.body);
  let networkSampleSent = false;
  const emitNetworkSample = (sample) => {
    if (networkSampleSent) return;
    const directRecorder = requestConfig?.onNetworkSample;
    const globalRecorder = typeof window !== 'undefined' ? window.__kryosNetworkRecorder : null;
    const recorder = typeof directRecorder === 'function'
      ? directRecorder
      : typeof globalRecorder === 'function'
        ? globalRecorder
        : null;
    if (!recorder) return;
    networkSampleSent = true;
    try {
      recorder({
        transport: 'http',
        url,
        requestBytes: Number.isFinite(requestBytes) ? requestBytes : 0,
        responseBytes: Number.isFinite(sample?.responseBytes) ? sample.responseBytes : 0,
        ok: Boolean(sample?.ok),
        status: sample?.status,
      });
    } catch (_err) {
      // ignore diagnostics recorder errors
    }
  };
  let timeoutId = null;
  if (controller) {
    timeoutId = timerApi.setTimeout(() => controller.abort(), timeoutMs);
  }
  try {
    const response = await fetch(url, finalOptions);
    const headerLength = Number(response.headers.get('content-length'));
    let responseBytes = Number.isFinite(headerLength) && headerLength >= 0 ? headerLength : null;
    if (!response.ok) {
      if (responseBytes === null) {
        const errorText = await response.text();
        responseBytes = getTextByteLength(errorText);
      }
      emitNetworkSample({ responseBytes: responseBytes || 0, ok: false, status: response.status });
      throw new Error('Request failed');
    }
    if (responseBytes === null) {
      const raw = await response.text();
      responseBytes = getTextByteLength(raw);
      const payload = raw ? JSON.parse(raw) : null;
      emitNetworkSample({ responseBytes: responseBytes || 0, ok: true, status: response.status });
      return payload;
    }
    const payload = await response.json();
    emitNetworkSample({ responseBytes: responseBytes || 0, ok: true, status: response.status });
    return payload;
  } catch (err) {
    emitNetworkSample({ responseBytes: 0, ok: false, status: null });
    console.warn('Falha ao chamar backend, usando dados de fallback', err?.message || err);
    return null;
  } finally {
    if (timeoutId !== null) {
      timerApi.clearTimeout(timeoutId);
    }
  }
}

function toTimestamp(value) {
  if (!value) return null;
  if (typeof value === 'number') return value;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

function formatRelativeAge(value) {
  const timestamp = toTimestamp(value);
  if (!timestamp) return null;
  const diffMs = Date.now() - timestamp;
  if (diffMs <= 10000) return 'agora';
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function formatTimestamp(value) {
  const timestamp = toTimestamp(value);
  if (!timestamp) return '--';
  return new Date(timestamp).toLocaleString();
}

const isFallbackReading = (reading) => {
  if (!reading) return false;
  if (reading.is_fallback) return true;
  const source = String(reading.source || '').toLowerCase();
  return source === 'fallback';
};

const codeAliases = {
  stu: 's_setpointwork',
  tgs: 'po3',
  teu: 'po4',
};

const displayAliases = {
  s_setpointwork: 'StU',
  po1: 'SH',
  po2: 'PPu',
  po3: 'tGS',
  po4: 'tEu',
  airoff: 'TA',
};

const mpxModbusIds = new Set([3, 4, 8, 9]);
const mpxPreferredCodes = ['Po1', 'Po2', 'Po3', 'Po4', 'airoff', 'OFFLINE'];
const bmbPreferredCodes = ['U01_PGL', 'U02_TRGL', 'm31_B1_ligada', 'm33_B2_ligada', 'm34_fluxo_falha'];
const trWaterPreferredCodes = ['U01_PAA', 'U03_TE1_TR', 'U04_TS1_TR', 'U05_TE2_TR', 'U06_TS2_TR'];
const skidPreferredCodes = ['m05_PS_geral', 'm06_PD_geral', 'm10_SH'];

const labelOverrides = {
  m05_ps_geral: 'Pressão de Sucção',
  m06_pd_geral: 'Pressão de Descarga',
  m10_sh: 'Superaquecimento',
  po1: 'Superaquecimento',
  po2: 'Abertura da válvula',
  po3: 'Temperatura de sucção (tGS)',
  po4: 'Temperatura de evaporação (tEu)',
  airoff: 'Temperatura (ta)',
  offline: 'Status desligado',
};

const unitOverrides = {
  m05_ps_geral: 'bar',
  m06_pd_geral: 'bar',
  m10_sh: 'K',
};

const normalizeCode = (code) => (code || '').toLowerCase();
const resolveCode = (code) => codeAliases[normalizeCode(code)] || normalizeCode(code);
const getDisplayCode = (code) => displayAliases[normalizeCode(code)] || code;
const resolveUnit = (code, unit) => unitOverrides[normalizeCode(code)] || unit || '';
const getDisplayLabel = (label, code) => {
  const normalizedCode = normalizeCode(code);
  const normalizedLabel = normalizeCode(label);
  if (label && normalizedLabel && normalizedLabel !== normalizedCode) {
    return label;
  }
  return labelOverrides[normalizedCode] || label || getDisplayCode(code);
};

const mergeTimeSeries = (baseSeries, incomingSeries, limit = 2000) => {
  const mergedMap = new Map();
  (Array.isArray(baseSeries) ? baseSeries : []).forEach((point) => {
    const t = Number(point?.t);
    const value = Number(point?.value);
    if (!Number.isFinite(t) || !Number.isFinite(value)) return;
    mergedMap.set(t, value);
  });
  (Array.isArray(incomingSeries) ? incomingSeries : []).forEach((point) => {
    const t = Number(point?.t);
    const value = Number(point?.value);
    if (!Number.isFinite(t) || !Number.isFinite(value)) return;
    mergedMap.set(t, value);
  });
  const next = Array.from(mergedMap.entries())
    .sort((left, right) => left[0] - right[0])
    .map(([t, value]) => ({ t, value }));
  return next.length > limit ? next.slice(-limit) : next;
};

const isSameTimeSeries = (seriesA, seriesB) => {
  const left = Array.isArray(seriesA) ? seriesA : [];
  const right = Array.isArray(seriesB) ? seriesB : [];
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index]?.t !== right[index]?.t) return false;
    if (left[index]?.value !== right[index]?.value) return false;
  }
  return true;
};

const interpolateSeriesValueAt = (series, targetTimestamp) => {
  if (!Array.isArray(series) || series.length === 0) return null;
  if (series.length === 1) return Number(series[0]?.value);
  const first = series[0];
  const last = series[series.length - 1];
  if (!first || !last) return null;
  if (targetTimestamp <= first.t) return Number(first.value);
  if (targetTimestamp >= last.t) return Number(last.value);

  let left = 0;
  let right = series.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const point = series[mid];
    if (!point) break;
    if (point.t === targetTimestamp) return Number(point.value);
    if (point.t < targetTimestamp) left = mid + 1;
    else right = mid - 1;
  }

  const lower = series[Math.max(0, right)];
  const upper = series[Math.min(series.length - 1, left)];
  if (!lower || !upper) return null;
  if (upper.t === lower.t) return Number(upper.value);
  const ratio = (targetTimestamp - lower.t) / (upper.t - lower.t);
  return Number(lower.value) + (Number(upper.value) - Number(lower.value)) * ratio;
};

const formatChartReading = (value, unit = '') => {
  if (!Number.isFinite(value)) return '--';
  const abs = Math.abs(value);
  const decimals = abs >= 100 ? 1 : abs >= 10 ? 2 : 3;
  const rendered = Number(value).toFixed(decimals);
  return unit ? `${rendered} ${unit}` : rendered;
};

const chartHistoryFillRatio = 0.95;
const chartMaxHistoryMs = 24 * 60 * 60 * 1000;

const trimSeriesToTimeWindow = (series, windowMs = chartMaxHistoryMs, anchorTimestamp = null) => {
  const source = Array.isArray(series) ? series : [];
  if (!source.length || !Number.isFinite(windowMs) || windowMs <= 0) {
    return source;
  }
  const anchor = Number(anchorTimestamp);
  const latest = Number.isFinite(anchor)
    ? anchor
    : source.reduce((max, point) => {
      const timestamp = Number(point?.t);
      if (!Number.isFinite(timestamp)) return max;
      return Math.max(max, timestamp);
    }, Number.NEGATIVE_INFINITY);
  if (!Number.isFinite(latest)) return source;
  const cutoff = latest - windowMs;
  return source.filter((point) => Number(point?.t) >= cutoff);
};

const buildSharedTimeRange = ({
  minTime,
  maxTime,
  previousRange = null,
  zoomRange = null,
  historyFillRatio = chartHistoryFillRatio,
  minRealtimeSpanMs = 5000,
  startupSpanMs = 0,
}) => {
  if (!Number.isFinite(minTime) || !Number.isFinite(maxTime)) return null;

  const safeMin = Math.min(minTime, maxTime);
  const safeMax = Math.max(minTime, maxTime);

  if (zoomRange?.start !== undefined && zoomRange?.end !== undefined) {
    const lockedStart = Math.min(zoomRange.start, zoomRange.end);
    const lockedEnd = Math.max(zoomRange.start, zoomRange.end);
    const safeEnd = lockedEnd <= lockedStart ? lockedStart + 1 : lockedEnd;
    return { start: lockedStart, end: safeEnd, min: safeMin, max: safeMax, realtimeStart: safeEnd };
  }

  const ratio = Number.isFinite(historyFillRatio)
    ? Math.max(0.5, Math.min(0.98, historyFillRatio))
    : chartHistoryFillRatio;
  const dataSpan = Math.max(1, safeMax - safeMin);
  const realtimeSpanByRatio = dataSpan * ((1 - ratio) / Math.max(ratio, 0.0001));
  const realtimeSpan = Math.max(minRealtimeSpanMs, realtimeSpanByRatio);
  const warmupSpan = Number.isFinite(startupSpanMs) ? Math.max(0, startupSpanMs) : 0;
  const totalSpan = Math.max(dataSpan + realtimeSpan, warmupSpan);

  let start = safeMin;
  let end = start + totalSpan;

  const prevStart = Number(previousRange?.start);
  const prevEnd = Number(previousRange?.end);
  if (Number.isFinite(prevStart) && Number.isFinite(prevEnd) && prevEnd > prevStart) {
    const previousSpan = prevEnd - prevStart;
    if (Number.isFinite(previousSpan) && previousSpan > totalSpan) {
      end = start + previousSpan;
    }
  }

  const safeEnd = end <= start ? start + 1 : end;
  const realtimeWidth = Math.max(1, (safeEnd - start) * (1 - ratio));
  const realtimeStart = Math.max(start, safeEnd - realtimeWidth);

  return { start, end: safeEnd, min: safeMin, max: safeMax, realtimeStart };
};

const fixedAlarmCodeProfiles = [
  {
    modelTokens: ['skid', 'panifresh', 'qualy'],
    codes: [
      'OFFLINE',
      'm34_fluxo_falha',
      'A01_falha_fluxo.Trigger',
      'A02_falha_B1.Trigger',
      'A03_falha_B2.Trigger',
      'A04_alta_temp_retor_glicol.Trigger',
      'A04_bx_temp_agua.Trigger',
      'A05_SPDB_falha.Trigger',
      'A05_PAA_falha.Trigger',
      'A06_STRGL_falha.Trigger',
      'A06_baixo_SH.Trigger',
      'A07_hi_press_gl.Trigger',
      'A07_pressao_baixa.Trigger',
      'A07_hi_PAA.Trigger',
      'A08_B1_B2_prot_flux.Trigger',
      'A09_STR1_falha.Trigger',
      'A09_STE1_falha.Trigger',
      'A10_STR2_falha.Trigger',
      'A10_STS1_falha.Trigger',
      'A11_STR3_falha.Trigger',
      'A11_STE2_falha.Trigger',
      'A12_STR4_falha.Trigger',
      'A12_STS2_falha.Trigger',
      'A01_falha_sonda_PS1.Trigger',
      'A02_falha_sonda_PS2.Trigger',
      'A03_falha_sonda_PD1.Trigger',
      'A04_falha_sonda_PD2.Trigger',
      'A05_falha_sonda_TS.Trigger',
    ],
  },
  {
    modelTokens: ['pjeasy'],
    codes: [
      'OFFLINE',
      'S_ALM_PORTA_APERTA',
      'S_ALM_SONDA_1',
      'S_ALM_SONDA_2',
      'S_ALM_SONDA_3',
      'S_ALM_TIMEOUT_DEFROST',
      'S_PRE_ALARM_PORTA_APERTA',
      'S_RELE_ALLARME',
    ],
  },
  {
    modelTokens: ['mpx'],
    codes: [
      'OFFLINE',
      's_ReleAlarm',
      's_HI',
      's_LO',
      's_HI2',
      's_LO2',
      's_IA',
      's_MA',
      's_Etc',
      's_Ed1',
      's_Ed2',
      's_Edc',
      's_pre1',
      's_pre2',
      's_pre3',
      's_pre4',
      's_pre5',
      's_pre6',
      's_pre7',
      's_re',
      's_u1',
      's_u2',
      's_u3',
      's_u4',
      's_u5',
      's_up1',
      's_up2',
      's_up3',
      's_up4',
      's_up5',
    ],
  },
];

const getFixedAlarmCodesForModel = (device) => {
  const modelKey = `${device?.model_file || ''} ${device?.device_code || ''} ${device?.family_code || ''}`.toLowerCase();
  if (!modelKey) return null;
  const codes = new Set();
  fixedAlarmCodeProfiles.forEach((profile) => {
    if (!profile.modelTokens.some((token) => modelKey.includes(token))) {
      return;
    }
    profile.codes.forEach((code) => {
      const normalized = resolveCode(code);
      if (normalized) {
        codes.add(normalized);
      }
    });
  });
  return codes.size ? codes : null;
};

const miniTitleMaxLength = 22;
const activePlantStorageKey = 'kryos_active_plant_id';

const formatMiniatureTitle = (rawName) => {
  const value = String(rawName || '').trim();
  if (!value) return '--';
  if (value.length <= miniTitleMaxLength) return value;
  const tokens = value.split('-').map((token) => token.trim()).filter(Boolean);
  if (tokens.length >= 4) {
    const shortened = tokens.map((token, index) => {
      if (index < 3 || index === tokens.length - 1) return token;
      return token.slice(0, 2);
    });
    let candidate = shortened.join('-');
    if (candidate.length <= miniTitleMaxLength) return candidate;
    const adaptive = [...shortened];
    for (let index = 0; index < adaptive.length - 1 && candidate.length > miniTitleMaxLength; index += 1) {
      const maxChars = index === 0 ? Math.min(4, adaptive[index].length) : Math.min(2, adaptive[index].length);
      adaptive[index] = adaptive[index].slice(0, maxChars);
      candidate = adaptive.join('-');
    }
    if (candidate.length <= miniTitleMaxLength) return candidate;
    const base = adaptive.slice(0, -1).join('-');
    const remainingTailChars = Math.max(1, miniTitleMaxLength - (base ? base.length + 1 : 0));
    const tail = adaptive[adaptive.length - 1].slice(0, remainingTailChars);
    return base ? `${base}-${tail}` : tail;
  }
  return value.slice(0, miniTitleMaxLength);
};

function useBackendData() {
  const initialSnapshotRef = useRef(null);
  if (initialSnapshotRef.current === null) {
    initialSnapshotRef.current = loadBackendSnapshot();
  }
  const initialSnapshot = initialSnapshotRef.current;
  const initialPlants = initialSnapshot?.plants || fallbackPlants;
  const initialDevices = initialSnapshot?.devices || fallbackDevices;
  const initialAlarms = initialSnapshot?.alarms || fallbackAlarms;

  const [plants, setPlants] = useState(initialPlants);
  const [devices, setDevices] = useState(initialDevices);
  const [alarms, setAlarms] = useState(initialAlarms);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [snapshotUpdatedAt, setSnapshotUpdatedAt] = useState(initialSnapshot?.updatedAt || null);
  const [hasDataSnapshot, setHasDataSnapshot] = useState(
    hasAnyBackendData(initialPlants, initialDevices, initialAlarms),
  );
  const hasLoadedOnceRef = useRef(false);
  const plantsRef = useRef(initialPlants);
  const devicesRef = useRef(initialDevices);
  const alarmsRef = useRef(initialAlarms);

  const pullData = useCallback(async (options = {}) => {
    const isBackground = Boolean(options?.background || hasLoadedOnceRef.current);
    if (isBackground) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const previousPlants = plantsRef.current || fallbackPlants;
      const previousDevices = devicesRef.current || fallbackDevices;
      const previousAlarms = alarmsRef.current || fallbackAlarms;

      const plantsResponse = await fetchJson('/api/plants', {}, { timeoutMs: 1200 });
      const hasPlantsPayload = Array.isArray(plantsResponse?.data);
      const nextPlants = hasPlantsPayload ? plantsResponse.data : previousPlants;
      const safePlants = Array.isArray(nextPlants) ? nextPlants : fallbackPlants;
      const nextDevices = {};
      const nextAlarms = {};

      await Promise.all(safePlants.map(async (plant) => {
        const plantId = Number(plant?.id);
        if (!Number.isFinite(plantId)) return;
        const [deviceResponse, alarmResponse] = await Promise.all([
          fetchJson(`/api/plants/${plantId}/devices`, {}, { timeoutMs: 1200 }),
          fetchJson(`/api/plants/${plantId}/alarms`, {}, { timeoutMs: 1200 }),
        ]);
        if (Array.isArray(deviceResponse?.data)) {
          nextDevices[plantId] = deviceResponse.data;
        } else if (Array.isArray(previousDevices[plantId])) {
          nextDevices[plantId] = previousDevices[plantId];
        } else {
          nextDevices[plantId] = [];
        }
        if (Array.isArray(alarmResponse?.data)) {
          nextAlarms[plantId] = alarmResponse.data;
        } else if (Array.isArray(previousAlarms[plantId])) {
          nextAlarms[plantId] = previousAlarms[plantId];
        } else {
          nextAlarms[plantId] = [];
        }
      }));

      if (!safePlants.length && !hasPlantsPayload) {
        Object.entries(previousDevices).forEach(([plantId, rows]) => {
          nextDevices[plantId] = Array.isArray(rows) ? rows : [];
        });
        Object.entries(previousAlarms).forEach(([plantId, rows]) => {
          nextAlarms[plantId] = Array.isArray(rows) ? rows : [];
        });
      }

      plantsRef.current = safePlants;
      devicesRef.current = nextDevices;
      alarmsRef.current = nextAlarms;
      setPlants(safePlants);
      setDevices(nextDevices);
      setAlarms(nextAlarms);
      const updatedAt = Date.now();
      setSnapshotUpdatedAt(updatedAt);
      const hasSnapshotData = hasAnyBackendData(safePlants, nextDevices, nextAlarms);
      setHasDataSnapshot(hasSnapshotData);
      persistBackendSnapshot({
        plants: safePlants,
        devices: nextDevices,
        alarms: nextAlarms,
        updatedAt,
      });
      hasLoadedOnceRef.current = true;
      setLoadedOnce(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    pullData();
  }, [pullData]);

  return {
    plants,
    devices,
    alarms,
    loading,
    refreshing,
    refresh: pullData,
    loadedOnce,
    hasDataSnapshot,
    snapshotUpdatedAt,
  };
}

function useBackendReadiness() {
  const [dbReady, setDbReady] = useState(false);
  const [probeReady, setProbeReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [reason, setReason] = useState(null);
  const [dbPingMs, setDbPingMs] = useState(null);
  const initialProbeDoneRef = useRef(false);
  const consecutiveFailuresRef = useRef(0);
  const failureThreshold = 3;

  useEffect(() => {
    let active = true;
    const runCheck = async () => {
      const response = await fetchJson('/api/system/readiness', {}, { timeoutMs: 1200 });
      if (!active) return;
      const probeOk = Boolean(response?.db_ready);
      const pingMs = Number(response?.db_ping_ms);
      setProbeReady(probeOk);
      setReason(response?.reason || (response ? null : 'readiness_unreachable'));
      setDbPingMs(Number.isFinite(pingMs) ? pingMs : null);
      if (probeOk) {
        consecutiveFailuresRef.current = 0;
        setDbReady(true);
      } else {
        consecutiveFailuresRef.current += 1;
        if (consecutiveFailuresRef.current >= failureThreshold || !initialProbeDoneRef.current) {
          setDbReady(false);
        }
      }
      setLastCheckedAt(Date.now());
      if (!initialProbeDoneRef.current) {
        setChecking(false);
        initialProbeDoneRef.current = true;
      }
    };
    runCheck();
    const intervalId = setInterval(runCheck, 2500);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  return { dbReady, probeReady, checking, lastCheckedAt, reason, dbPingMs };
}

function BackendLoadingScreen({ title = 'Carregando', message = 'Aguardando banco de dados...' }) {
  return (
    <main className="page">
      <div className="telemetry-loading" role="status" aria-live="polite">
        <div className="telemetry-loading-card">
          <div className="telemetry-loading-bar"><span /></div>
          <strong>{title}</strong>
          <span className="micro muted">{message}</span>
        </div>
      </div>
    </main>
  );
}

function TopNav({ theme, onThemeChange, isThemeModalOpen, onOpenThemeModal, onCloseThemeModal, user }) {
  const location = useLocation();
  const links = [
    { to: '/plants', label: 'Plantas' },
    { to: '/', label: 'Dashboard' },
    { to: '/setup', label: 'Setup' },
    { to: '/admin', label: 'Admin' },
    { to: '/ai', label: 'IA' },
  ];

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="eyebrow">Kryos</span>
          <strong>Supervisor</strong>
        </div>
        <nav className="nav-links" aria-label="Navegação principal">
          {links.map((link) => (
            <Link key={link.to} className={location.pathname === link.to ? 'active' : ''} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="topbar-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Abrir seleção de esquema de cores"
            onClick={onOpenThemeModal}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M12 2.75l1.45 2.94 3.24.47-2.35 2.3.55 3.22L12 10.7l-2.89 1.5.55-3.22-2.35-2.3 3.24-.47L12 2.75z"
                fill="currentColor"
                opacity="0.35"
              />
              <path
                d="M12 7.5a4.5 4.5 0 0 1 4.5 4.5 4.5 4.5 0 1 1-9 0A4.5 4.5 0 0 1 12 7.5zm9 4.5-2.04.39-.68 1.64 1.2 1.7-1.77 1.77-1.7-1.2-1.64.68-.39 2.04h-2.5l-.39-2.04-1.64-.68-1.7 1.2-1.77-1.77 1.2-1.7-.68-1.64L3 12l.39-2.04 1.64-.68-1.2-1.7 1.77-1.77 1.7 1.2 1.64-.68L9.5 3h2.5l.39 2.04 1.64.68 1.7-1.2 1.77 1.77-1.2 1.7.68 1.64L21 12z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="user-pill">{user ? user.name : 'Visitante'}</div>
        </div>
      </header>

      {isThemeModalOpen && (
        <div className="theme-modal-overlay" role="dialog" aria-modal="true" onClick={onCloseThemeModal}>
          <div className="theme-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Esquema de cores</p>
                <h3>Selecione um tema</h3>
              </div>
              <button type="button" className="ghost" onClick={onCloseThemeModal}>
                Fechar
              </button>
            </div>
            <div className="theme-options" role="list">
              {Object.entries(themeOptions).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  role="listitem"
                  className={`theme-option ${theme === key ? 'active' : ''}`}
                  onClick={() => {
                    onThemeChange(key);
                    onCloseThemeModal();
                  }}
                >
                  <span className={`theme-swatch ${key}`} aria-hidden="true" />
                  <div className="theme-option-text">
                    <strong>{value.label}</strong>
                    <span className="micro muted">{value.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LoginPage({ onLogin, backendReady, backendChecking, backendCheckedAt }) {
  const [email, setEmail] = useState('cliente@kryos.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!backendReady) {
      setError('Sistema ainda inicializando. Aguarde o banco de dados ficar pronto.');
      return;
    }
    const payload = { email, password };

    const response = await fetchJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response) {
      onLogin({ name: 'Cliente Demo', role: 'cliente', email });
      navigate(from);
      return;
    }

    if (response?.token) {
      onLogin({ ...response.user, token: response.token });
      navigate(from);
      return;
    }

    onLogin({ name: 'Cliente Demo', role: 'cliente', email });
    navigate(from);
  };

  return (
    <main className="page">
      {!backendReady && (
        <div className="login-readiness-overlay" role="status" aria-live="polite">
          <div className="telemetry-loading-card telemetry-loading-float login-readiness-card">
            <div className="telemetry-loading-bar"><span /></div>
            <strong>Inicializando sistema</strong>
            <span className="micro muted">
              {backendChecking ? 'Conectando ao banco de dados...' : 'Aguardando banco de dados...'}
            </span>
            {backendCheckedAt && (
              <span className="micro muted">Ultima verificacao: {formatTimestamp(backendCheckedAt)}</span>
            )}
          </div>
        </div>
      )}
      <section className="panel narrow">
        <p className="eyebrow">Login seguro</p>
        <h1>Entrar</h1>
        <p className="muted">Use suas credenciais ou continue com o usuário demo.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Senha
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••" />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary" disabled={!backendReady}>
            {backendReady ? 'Acessar' : 'Aguardando banco...'}
          </button>
        </form>
      </section>
    </main>
  );
}

function PlantDashboard({
  plants,
  devices,
  alarms,
  activePlantId,
  onSelectPlant,
  loading,
  refreshing,
  refresh,
  user,
  backendReady,
  backendProbeReady,
  backendReason,
  backendCheckedAt,
  snapshotUpdatedAt,
  backendPingMs,
}) {
  const activePlant = plants.find((p) => p.id === activePlantId) || plants[0];
  const [deviceNameOverrides, setDeviceNameOverrides] = useState({});
  const basePlantDevices = devices[activePlant?.id] || [];
  const plantDevices = useMemo(
    () => basePlantDevices.map((device) => {
      const override = deviceNameOverrides[device.id];
      if (!override || override === device.name) return device;
      return { ...device, name: override };
    }),
    [basePlantDevices, deviceNameOverrides],
  );
  const plantAlarms = alarms[activePlant?.id] || [];
  const readWriteVariableCatalog = [
    { code: 's_SetpointWork', unit: '°C/°F', description: 'Ponto de ajuste de regulacao' },
    { code: 'rd', unit: '°C/°F', description: 'Diferencial de regulacao (ar ligado/desligado (Sm) com termostato duplo)' },
    { code: 'dt1', unit: '°C/°F', description: 'Limite de temperatura final de degelo' },
    { code: 'dP1', unit: 'min', description: 'Duracao maxima do degelo' },
    { code: 'AL', unit: '°C/°F', description: 'Limiar de alarme de baixa temperatura (sonda Sm com ar desligado para termostato duplo)' },
    { code: 'AH', unit: '°C/°F', description: 'Limiar de alarme de alta temperatura (sonda de ar desligado (Sm) para termostato duplo)' },
    { code: 'P3', unit: 'K', description: 'Ponto de ajuste de superaquecimento' },
    { code: 'P7', unit: 'K', description: 'Limiar LSH (baixo superaquecimento)' },
    { code: 'PM1', unit: '°C/°F', description: 'Limiar MOP (temperatura de evaporacao elevada)' },
    { code: 'cP1', unit: '%', description: 'Abertura da valvula de partida (relacao de capacidade EVAP/EEV)' },
    { code: 's_PMP', unit: '', description: 'Ativar o posicionamento manual da EEV' },
    { code: 's_PMu', unit: 'etapa', description: 'Posicao manual da valvula de escape de oleo (EEV)' },
  ];
  const loadMiniWidgetSettings = () => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem('miniWidgetModeByDevice');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
      }
      const legacyRaw = window.localStorage.getItem('miniGraphEnabledByDevice');
      if (!legacyRaw) return {};
      const legacy = JSON.parse(legacyRaw);
      const next = {};
      Object.entries(legacy || {}).forEach(([deviceId, enabled]) => {
        if (enabled) {
          next[deviceId] = 'graph';
        }
      });
      return next;
    } catch (err) {
      return {};
    }
  };
  const loadMiniGraphVariableSettings = () => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem('miniGraphVariableIdsByDevice');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return {};
      const next = {};
      Object.entries(parsed).forEach(([deviceId, ids]) => {
        if (!Array.isArray(ids)) return;
        const sanitized = ids
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value))
          .slice(0, 3);
        if (sanitized.length) {
          next[deviceId] = sanitized;
        }
      });
      return next;
    } catch (err) {
      return {};
    }
  };

  const [telemetryByDevice, setTelemetryByDevice] = useState({});
  const [telemetryReady, setTelemetryReady] = useState(false);
  const [deviceVarsMap, setDeviceVarsMap] = useState({});
  const [dashboardVariables, setDashboardVariables] = useState({});
  const [deviceAssets, setDeviceAssets] = useState({});
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [deviceVariables, setDeviceVariables] = useState([]);
  const [selectedVariableIds, setSelectedVariableIds] = useState([]);
  const [selectedMiniGraphVariableIds, setSelectedMiniGraphVariableIds] = useState([]);
  const [isMiniGraphVariablePickerOpen, setIsMiniGraphVariablePickerOpen] = useState(false);
  const [miniGraphVariableIdsByDevice, setMiniGraphVariableIdsByDevice] = useState(loadMiniGraphVariableSettings);
  const [saveVariablesPending, setSaveVariablesPending] = useState(false);
  const [graphDeviceId, setGraphDeviceId] = useState(null);
  const [graphViewMode, setGraphViewMode] = useState('main');
  const [miniChartHover, setMiniChartHover] = useState(null);
  const [deviceNameDraft, setDeviceNameDraft] = useState('');
  const [saveDeviceNamePending, setSaveDeviceNamePending] = useState(false);
  const [rwInputs, setRwInputs] = useState({});
  const [rwStatus, setRwStatus] = useState({});
  const [telemetryOverview, setTelemetryOverview] = useState({ data: [], db_ready: false });
  const [telemetryOverviewUpdatedAt, setTelemetryOverviewUpdatedAt] = useState(null);
  const [isRealtimeRefreshing, setIsRealtimeRefreshing] = useState(false);
  const [showRealtimeOverlay, setShowRealtimeOverlay] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [miniSeriesByDevice, setMiniSeriesByDevice] = useState({});
  const telemetryByDeviceRef = useRef({});
  const telemetryFetchInFlight = useRef(false);
  const overviewFetchInFlight = useRef(false);
  const deviceSocketsRef = useRef({});
  const diagnosticPanelRef = useRef(null);
  const miniCardRefs = useRef({});
  const miniTitleRefs = useRef({});
  const miniLeftRefs = useRef({});
  const miniRangeRef = useRef({});
  const diagnosticsRef = useRef({
    realtimeRefresh: [],
    telemetryRealtime: [],
    overviewFetch: [],
    deviceRealtime: {},
    variableLatency: {},
    variableMeta: {},
    variableLastSeen: {},
    networkDownBps: [],
    networkUpBps: [],
    networkTotalDownBytes: 0,
    networkTotalUpBytes: 0,
    networkWindowStartedAt: null,
    networkWindowDownBytes: 0,
    networkWindowUpBytes: 0,
    lastUpdatedAt: null,
  });
  const diagnosticsUpdateTimer = useRef(null);
  const realtimeOverlayTimerRef = useRef(null);
  const [diagnosticsTick, setDiagnosticsTick] = useState(0);
  const [miniWidgetModeByDevice, setMiniWidgetModeByDevice] = useState(loadMiniWidgetSettings);
  const [deviceQuery, setDeviceQuery] = useState('');
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('all');
  const [deviceSortMode, setDeviceSortMode] = useState('address');
  const [deviceLayoutMode, setDeviceLayoutMode] = useState('grid');
  const telemetryWindowMinutes = 15;
  const telemetryPollMs = 5000;
  const miniSeriesLimit = 120;
  const miniGraphColors = ['#16a34a', '#0ea5e9', '#f59e0b'];
  const importantCodes = useMemo(() => skidPreferredCodes, []);
  const canEditDeviceName = user?.role === 'supervisor' || user?.role === 'administrador';
  const canEditLabels = canEditDeviceName;
  const diagnosticsSampleLimit = 24;

  const scheduleDiagnosticsUpdate = useCallback(() => {
    if (diagnosticsUpdateTimer.current) return;
    const timerApi = typeof window !== 'undefined' ? window : globalThis;
    diagnosticsUpdateTimer.current = timerApi.setTimeout(() => {
      diagnosticsUpdateTimer.current = null;
      setDiagnosticsTick((prev) => prev + 1);
    }, 200);
  }, []);

  const pushSample = useCallback((list, value) => {
    if (!Number.isFinite(value)) return list || [];
    const next = Array.isArray(list) ? list : [];
    next.push(value);
    if (next.length > diagnosticsSampleLimit) {
      next.splice(0, next.length - diagnosticsSampleLimit);
    }
    return next;
  }, [diagnosticsSampleLimit]);

  const recordNetworkTraffic = useCallback((direction, bytes) => {
    const normalizedBytes = Number(bytes);
    if (!Number.isFinite(normalizedBytes) || normalizedBytes <= 0) return;
    const store = diagnosticsRef.current;
    const now = Date.now();
    if (!Number.isFinite(store.networkWindowStartedAt) || store.networkWindowStartedAt <= 0) {
      store.networkWindowStartedAt = now;
    }
    if (direction === 'down') {
      store.networkWindowDownBytes = Number(store.networkWindowDownBytes || 0) + normalizedBytes;
      store.networkTotalDownBytes = Number(store.networkTotalDownBytes || 0) + normalizedBytes;
    } else if (direction === 'up') {
      store.networkWindowUpBytes = Number(store.networkWindowUpBytes || 0) + normalizedBytes;
      store.networkTotalUpBytes = Number(store.networkTotalUpBytes || 0) + normalizedBytes;
    } else {
      return;
    }
    const elapsedMs = Math.max(1, now - Number(store.networkWindowStartedAt || now));
    if (elapsedMs >= 1000) {
      const downBps = (Number(store.networkWindowDownBytes || 0) * 8 * 1000) / elapsedMs;
      const upBps = (Number(store.networkWindowUpBytes || 0) * 8 * 1000) / elapsedMs;
      if (downBps > 0) {
        store.networkDownBps = pushSample(store.networkDownBps || [], downBps);
      }
      if (upBps > 0) {
        store.networkUpBps = pushSample(store.networkUpBps || [], upBps);
      }
      store.networkWindowDownBytes = 0;
      store.networkWindowUpBytes = 0;
      store.networkWindowStartedAt = now;
    }
    store.lastUpdatedAt = now;
    scheduleDiagnosticsUpdate();
  }, [pushSample, scheduleDiagnosticsUpdate]);

  const recordDiagnosticsSample = useCallback((bucket, value) => {
    if (!Number.isFinite(value)) return;
    const store = diagnosticsRef.current;
    store[bucket] = pushSample(store[bucket] || [], value);
    store.lastUpdatedAt = Date.now();
    scheduleDiagnosticsUpdate();
  }, [pushSample, scheduleDiagnosticsUpdate]);

  const recordDeviceLatency = useCallback((deviceId, value) => {
    if (!Number.isFinite(value)) return;
    const store = diagnosticsRef.current;
    const key = String(deviceId);
    store.deviceRealtime[key] = pushSample(store.deviceRealtime[key] || [], value);
    store.lastUpdatedAt = Date.now();
    scheduleDiagnosticsUpdate();
  }, [pushSample, scheduleDiagnosticsUpdate]);

  const recordVariableLatency = useCallback((deviceId, reading, value) => {
    if (!Number.isFinite(value)) return;
    const normalized = resolveCode(reading?.code);
    if (!normalized) return;
    const store = diagnosticsRef.current;
    const key = `${deviceId}:${normalized}`;
    store.variableLatency[key] = pushSample(store.variableLatency[key] || [], value);
    store.variableMeta[key] = {
      deviceId: Number(deviceId),
      code: reading?.code || normalized,
      label: reading?.label,
    };
    store.lastUpdatedAt = Date.now();
    scheduleDiagnosticsUpdate();
  }, [pushSample, scheduleDiagnosticsUpdate]);

  const getPreferredCodesForDevice = (deviceId) => {
    if (hasDeviceCodeMatch(deviceId, trWaterPreferredCodes)) return trWaterPreferredCodes;
    if (isMpxDevice(deviceId)) return mpxPreferredCodes;
    if (isBmbDevice(deviceId)) return bmbPreferredCodes;
    return skidPreferredCodes;
  };
  const getReadWriteVariablesForDevice = (deviceId) =>
    (isMpxDevice(deviceId) ? readWriteVariableCatalog : []);
  const filterVariablesForDevice = (deviceId, variables) => {
    const preferred = getPreferredCodesForDevice(deviceId);
    if (!preferred || preferred.length === 0) return variables;
    const preferredSet = new Set(preferred.map(resolveCode));
    const filtered = variables.filter((variable) => preferredSet.has(resolveCode(variable.code)));
    return filtered.length ? filtered : variables;
  };
  const isSameReadingSnapshot = useCallback((leftRows, rightRows) => {
    const left = Array.isArray(leftRows) ? leftRows : [];
    const right = Array.isArray(rightRows) ? rightRows : [];
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      const leftRow = left[index] || {};
      const rightRow = right[index] || {};
      if (String(leftRow.code || '') !== String(rightRow.code || '')) return false;
      if (Number(leftRow.value) !== Number(rightRow.value)) return false;
      if (String(leftRow.captured_at || '') !== String(rightRow.captured_at || '')) return false;
      if (String(leftRow.source || '') !== String(rightRow.source || '')) return false;
      if (String(leftRow.status || '') !== String(rightRow.status || '')) return false;
    }
    return true;
  }, []);

  const fetchDeviceTelemetrySnapshot = useCallback(async (
    deviceId,
    { forceRealtime = false, timeoutMs = 1200 } = {},
  ) => {
    const startedAt = performance.now();
    const realtimeUrl = `/api/devices/${deviceId}/readings?scope=dashboard&persist=false`;
    const latestUrl = `/api/devices/${deviceId}/telemetry/latest`;
    const readRows = (payload) => {
      const rows = payload?.latest || payload?.readings || [];
      return Array.isArray(rows) ? rows : [];
    };
    try {
      if (forceRealtime) {
        const realtimePromise = fetchJson(realtimeUrl, {}, { timeoutMs })
          .then((payload) => readRows(payload))
          .catch(() => []);
        const fallbackPromise = fetchJson(latestUrl, {}, { timeoutMs: Math.min(timeoutMs, 320) })
          .then((payload) => readRows(payload))
          .catch(() => []);
        const fallbackRows = await fallbackPromise;
        if (fallbackRows.length) {
          const timerApi = typeof window !== 'undefined' ? window : globalThis;
          let waitId = null;
          const realtimeRows = await Promise.race([
            realtimePromise,
            new Promise((resolve) => {
              waitId = timerApi.setTimeout(() => resolve([]), 220);
            }),
          ]);
          if (waitId !== null) {
            timerApi.clearTimeout(waitId);
          }
          if (Array.isArray(realtimeRows) && realtimeRows.length) {
            return { deviceId, readings: realtimeRows };
          }
          return { deviceId, readings: fallbackRows };
        }
        const realtimeRows = await realtimePromise;
        if (Array.isArray(realtimeRows) && realtimeRows.length) {
          return { deviceId, readings: realtimeRows };
        }
        return { deviceId, readings: fallbackRows };
      }
      const latest = await fetchJson(latestUrl, {}, { timeoutMs: Math.min(timeoutMs, 320) });
      const latestRows = readRows(latest);
      if (latestRows.length) {
        return { deviceId, readings: latestRows };
      }
      const realtime = await fetchJson(realtimeUrl, {}, { timeoutMs });
      const realtimeRows = readRows(realtime);
      return { deviceId, readings: Array.isArray(realtimeRows) ? realtimeRows : [] };
    } finally {
      if (forceRealtime) {
        recordDeviceLatency(deviceId, performance.now() - startedAt);
      }
    }
  }, [recordDeviceLatency]);

  const fetchTelemetrySnapshot = useCallback(async (
    { forceRealtime = false, timeoutMs = 1200, allowConcurrent = false } = {},
  ) => {
    if (!plantDevices.length) return;
    if (telemetryFetchInFlight.current && !allowConcurrent) return;
    const startedAt = performance.now();
    const ownsInFlightLock = !telemetryFetchInFlight.current;
    if (ownsInFlightLock) {
      telemetryFetchInFlight.current = true;
    }
    try {
      const deviceQueue = [...plantDevices];
      const results = [];
      const maxConcurrency = Math.max(1, Math.min(6, deviceQueue.length));
      const workers = Array.from({ length: maxConcurrency }, async () => {
        while (deviceQueue.length > 0) {
          const nextDevice = deviceQueue.shift();
          if (!nextDevice) continue;
          const snapshot = await fetchDeviceTelemetrySnapshot(nextDevice.id, { forceRealtime, timeoutMs });
          results.push(snapshot);
        }
      });
      await Promise.all(workers);
      const currentTelemetry = telemetryByDeviceRef.current || {};
      const nextTelemetry = { ...currentTelemetry };
      let changed = false;
      results.forEach((result) => {
        const readings = Array.isArray(result?.readings) ? result.readings : [];
        const currentReadings = Array.isArray(nextTelemetry[result.deviceId]) ? nextTelemetry[result.deviceId] : [];
        if (readings.length) {
          if (!isSameReadingSnapshot(currentReadings, readings)) {
            nextTelemetry[result.deviceId] = readings;
            changed = true;
          }
          return;
        }
        if (!currentReadings.length && !Object.prototype.hasOwnProperty.call(nextTelemetry, result.deviceId)) {
          nextTelemetry[result.deviceId] = [];
          changed = true;
        }
      });
      const telemetrySnapshot = changed ? nextTelemetry : currentTelemetry;
      telemetryByDeviceRef.current = telemetrySnapshot;
      if (changed) {
        setTelemetryByDevice(telemetrySnapshot);
      }
      const hasAnyReadings = plantDevices.some((device) => {
        const readings = telemetrySnapshot[device.id];
        return Array.isArray(readings) && readings.length;
      });
      if (hasAnyReadings) {
        setTelemetryReady(true);
      }
    } finally {
      if (ownsInFlightLock) {
        telemetryFetchInFlight.current = false;
      }
      if (forceRealtime) {
        recordDiagnosticsSample('telemetryRealtime', performance.now() - startedAt);
      }
    }
  }, [fetchDeviceTelemetrySnapshot, isSameReadingSnapshot, plantDevices, recordDiagnosticsSample]);

  const handleRealtimeRefresh = useCallback(async () => {
    if (isRealtimeRefreshing) return;
    setIsRealtimeRefreshing(true);
    if (realtimeOverlayTimerRef.current) {
      clearTimeout(realtimeOverlayTimerRef.current);
    }
    realtimeOverlayTimerRef.current = setTimeout(() => {
      setShowRealtimeOverlay(true);
    }, 200);
    const startedAt = performance.now();
    try {
      // Atualiza dados gerais em paralelo sem bloquear a leitura realtime forçada.
      void refresh({ background: true });
      await fetchTelemetrySnapshot({ forceRealtime: true, timeoutMs: 1200, allowConcurrent: true });
    } finally {
      const elapsed = performance.now() - startedAt;
      recordDiagnosticsSample('realtimeRefresh', elapsed);
      if (realtimeOverlayTimerRef.current) {
        clearTimeout(realtimeOverlayTimerRef.current);
        realtimeOverlayTimerRef.current = null;
      }
      setShowRealtimeOverlay(false);
      setIsRealtimeRefreshing(false);
    }
  }, [fetchTelemetrySnapshot, isRealtimeRefreshing, recordDiagnosticsSample, refresh]);

  useEffect(() => () => {
    if (realtimeOverlayTimerRef.current) {
      clearTimeout(realtimeOverlayTimerRef.current);
      realtimeOverlayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setTelemetryReady(false);
    const timerApi = typeof window !== 'undefined' ? window : globalThis;
    const timerId = timerApi.setTimeout(() => {
      setTelemetryReady(true);
    }, 1200);
    return () => {
      timerApi.clearTimeout(timerId);
    };
  }, [activePlant?.id]);

  useEffect(() => {
    telemetryByDeviceRef.current = telemetryByDevice;
  }, [telemetryByDevice]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const previousRecorder = window.__kryosNetworkRecorder;
    const networkRecorder = (sample) => {
      const upload = Number(sample?.requestBytes);
      const download = Number(sample?.responseBytes);
      if (Number.isFinite(upload) && upload > 0) {
        recordNetworkTraffic('up', upload);
      }
      if (Number.isFinite(download) && download > 0) {
        recordNetworkTraffic('down', download);
      }
    };
    window.__kryosNetworkRecorder = networkRecorder;
    return () => {
      if (window.__kryosNetworkRecorder === networkRecorder) {
        if (typeof previousRecorder === 'function') {
          window.__kryosNetworkRecorder = previousRecorder;
        } else {
          delete window.__kryosNetworkRecorder;
        }
      }
    };
  }, [recordNetworkTraffic]);

  useEffect(() => {
    if (!loading && !plantDevices.length) {
      setTelemetryReady(true);
    }
  }, [loading, plantDevices]);

  useEffect(() => {
    let active = true;
    const runTelemetry = async () => {
      if (!active) return;
      await fetchTelemetrySnapshot();
    };
    runTelemetry();
    const intervalId = setInterval(runTelemetry, telemetryPollMs);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [fetchTelemetrySnapshot, telemetryPollMs]);

  useEffect(() => {
    if (telemetryReady) return;
    const hasAnyReadings = plantDevices.some((device) => {
      const readings = telemetryByDevice[device.id];
      return Array.isArray(readings) && readings.length;
    });
    if (hasAnyReadings) {
      setTelemetryReady(true);
    }
  }, [plantDevices, telemetryByDevice, telemetryReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('miniWidgetModeByDevice', JSON.stringify(miniWidgetModeByDevice));
      const legacy = {};
      Object.entries(miniWidgetModeByDevice).forEach(([deviceId, mode]) => {
        if (mode === 'graph') {
          legacy[deviceId] = true;
        }
      });
      window.localStorage.setItem('miniGraphEnabledByDevice', JSON.stringify(legacy));
    } catch (err) {
      // ignore storage errors
    }
  }, [miniWidgetModeByDevice]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('miniGraphVariableIdsByDevice', JSON.stringify(miniGraphVariableIdsByDevice));
    } catch (err) {
      // ignore storage errors
    }
  }, [miniGraphVariableIdsByDevice]);

  useEffect(() => {
    setMiniSeriesByDevice((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.entries(telemetryByDevice).forEach(([deviceId, readings]) => {
        if (!Array.isArray(readings) || readings.length === 0) return;
        const deviceSeries = { ...(next[deviceId] || {}) };
        let deviceChanged = false;
        readings.forEach((reading) => {
          const normalized = resolveCode(reading?.code);
          if (!normalized) return;
          const value = Number(reading?.value);
          if (!Number.isFinite(value)) return;
          const capturedAt = toTimestamp(reading?.captured_at) || Date.now();
          const currentSeries = Array.isArray(deviceSeries[normalized]) ? deviceSeries[normalized] : [];
          const mergedSeries = trimSeriesToTimeWindow(
            mergeTimeSeries(currentSeries, [{ t: capturedAt, value }], miniSeriesLimit),
            chartMaxHistoryMs,
            capturedAt,
          );
          if (isSameTimeSeries(currentSeries, mergedSeries)) return;
          deviceSeries[normalized] = mergedSeries;
          deviceChanged = true;
        });
        if (deviceChanged) {
          next[deviceId] = deviceSeries;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [telemetryByDevice, miniSeriesLimit]);

  useEffect(() => {
    const activeIds = new Set(plantDevices.map((device) => String(device.id)));
    Object.keys(miniRangeRef.current).forEach((deviceId) => {
      if (activeIds.has(String(deviceId))) return;
      delete miniRangeRef.current[deviceId];
    });
  }, [plantDevices]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.WebSocket) return () => {};
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const sockets = deviceSocketsRef.current || {};
    const activeDeviceIds = new Set();

    plantDevices.forEach((device) => {
      const modbusId = Number(device.modbus_id);
      activeDeviceIds.add(device.id);
      if (sockets[device.id]) return;
      const socketUrl = `${protocol}://${host}/ws/devices/${device.id}/telemetry`;
      const ws = new WebSocket(socketUrl);
      sockets[device.id] = ws;
      ws.onmessage = (event) => {
        try {
          recordNetworkTraffic('down', estimatePayloadBytes(event?.data));
          const payload = JSON.parse(event.data || '{}');
          if (!payload?.readings) return;
          setTelemetryByDevice((prev) => {
            const incoming = Array.isArray(payload.readings) ? payload.readings : [];
            const current = Array.isArray(prev[device.id]) ? prev[device.id] : [];
            if (isSameReadingSnapshot(current, incoming)) {
              return prev;
            }
            const next = { ...prev, [device.id]: incoming };
            telemetryByDeviceRef.current = next;
            return next;
          });
        } catch (err) {
          console.warn(`Falha ao processar websocket do device ${device.modbus_id}`, err);
        }
      };
      ws.onerror = (event) => {
        console.warn(`WebSocket device ${device.modbus_id} erro`, event);
      };
    });

    Object.keys(sockets).forEach((deviceId) => {
      if (activeDeviceIds.has(Number(deviceId))) return;
      try {
        sockets[deviceId].close();
      } catch (err) {
        console.warn('Falha ao fechar websocket', err);
      }
      delete sockets[deviceId];
    });

    deviceSocketsRef.current = sockets;
    return () => {
      Object.keys(sockets).forEach((deviceId) => {
        try {
          sockets[deviceId].close();
        } catch (err) {
          console.warn('Falha ao fechar websocket', err);
        }
      });
      deviceSocketsRef.current = {};
    };
  }, [isSameReadingSnapshot, plantDevices, recordNetworkTraffic]);

  useEffect(() => {
    let active = true;
    const fetchOverview = async () => {
      if (!activePlant?.id || overviewFetchInFlight.current) return;
      const startedAt = performance.now();
      overviewFetchInFlight.current = true;
      try {
        const response = await fetchJson(
          `/api/telemetry/overview?plant_id=${activePlant.id}&window_minutes=${telemetryWindowMinutes}`,
          {},
          { timeoutMs: 1200 },
        );
        if (active && response) {
          setTelemetryOverview(response);
          setTelemetryOverviewUpdatedAt(Date.now());
        }
      } finally {
        overviewFetchInFlight.current = false;
        recordDiagnosticsSample('overviewFetch', performance.now() - startedAt);
      }
    };
    fetchOverview();
    const intervalId = setInterval(fetchOverview, telemetryPollMs);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [activePlant?.id, telemetryWindowMinutes, recordDiagnosticsSample]);

  useEffect(() => {
    let active = true;
    const loadExtras = async () => {
      if (!plantDevices.length) return;
      const assetsMap = {};
      const dashboardMap = {};
      const miniGraphMap = {};
      const varsMap = {};
      await Promise.all(plantDevices.map(async (device) => {
        const [assetResponse, dashboardResponse, miniGraphResponse, varsResponse] = await Promise.all([
          fetchJson(`/api/devices/${device.id}/asset`),
          fetchJson(`/api/devices/${device.id}/dashboard-variables`),
          fetchJson(`/api/devices/${device.id}/mini-graph-variables`),
          fetchJson(`/api/devices/${device.id}/variables`),
        ]);
        if (assetResponse) {
          assetsMap[device.id] = assetResponse;
        }
        if (dashboardResponse && Array.isArray(dashboardResponse.data)) {
          dashboardMap[device.id] = dashboardResponse.data;
        }
        if (miniGraphResponse && Array.isArray(miniGraphResponse.data)) {
          const selected = miniGraphResponse.data
            .map((row) => Number(row?.variable_id))
            .filter((value) => Number.isFinite(value))
            .slice(0, 3);
          if (selected.length) {
            miniGraphMap[device.id] = selected;
          }
        }
        if (varsResponse?.data) {
          varsMap[device.id] = varsResponse.data;
        }
      }));
      if (active) {
        setDeviceAssets(assetsMap);
        setDashboardVariables(dashboardMap);
        setDeviceVarsMap(varsMap);
        setMiniGraphVariableIdsByDevice((prev) => {
          const next = { ...prev };
          const activeDeviceIds = new Set(plantDevices.map((device) => Number(device.id)));
          Object.keys(next).forEach((deviceId) => {
            if (!activeDeviceIds.has(Number(deviceId))) {
              delete next[deviceId];
            }
          });
          plantDevices.forEach((device) => {
            const serverSelection = miniGraphMap[device.id];
            if (Array.isArray(serverSelection) && serverSelection.length) {
              next[device.id] = serverSelection;
              return;
            }
            const hasLocalSelection = Array.isArray(next[device.id]) && next[device.id].length > 0;
            if (hasLocalSelection) return;
            const fallbackSelection = (dashboardMap[device.id] || [])
              .map((row) => Number(row?.variable_id))
              .filter((value) => Number.isFinite(value))
              .slice(0, 3);
            if (fallbackSelection.length) {
              next[device.id] = fallbackSelection;
            }
          });
          return next;
        });
      }
    };
    loadExtras();
    return () => {
      active = false;
    };
  }, [plantDevices]);

  const telemetryOverviewRows = useMemo(() => {
    const data = telemetryOverview?.data || [];
    if (!activePlant?.id) return data;
    return data.filter((row) => row.plant_id === activePlant.id);
  }, [telemetryOverview, activePlant?.id]);

  const telemetryOverviewByDevice = useMemo(() => {
    const map = {};
    telemetryOverviewRows.forEach((row) => {
      map[row.device_id] = row;
    });
    return map;
  }, [telemetryOverviewRows]);

  const deviceById = useMemo(() => {
    const map = {};
    plantDevices.forEach((device) => {
      map[device.id] = device;
    });
    return map;
  }, [plantDevices]);
  const hasDeviceCodeMatch = (deviceId, codes) => {
    if (!codes || codes.length === 0) return false;
    const expected = new Set(codes.map(resolveCode));
    const vars = deviceVarsMap[deviceId] || [];
    if (vars.some((item) => expected.has(resolveCode(item.code)))) return true;
    const readings = telemetryByDevice[deviceId] || [];
    return readings.some((item) => expected.has(resolveCode(item.code)));
  };

  const isBmbDevice = (deviceId) => {
    const device = deviceById[deviceId];
    const modelFile = (device?.model_file || '').toLowerCase();
    const name = (device?.name || '').toLowerCase();
    if (modelFile.includes('bmb') || name.includes('bmb') || name.includes('bomb')) return true;
    return hasDeviceCodeMatch(deviceId, bmbPreferredCodes);
  };

  const isMpxDevice = (deviceId) => {
    const device = deviceById[deviceId];
    const modelKey = `${device?.model_file || ''} ${device?.device_code || ''} ${device?.family_code || ''}`.toLowerCase();
    if (modelKey.includes('bmb') || modelKey.includes('bomb')) return false;
    if (modelKey.includes('mpx')) return true;
    if (hasDeviceCodeMatch(deviceId, bmbPreferredCodes)) return false;
    if (hasDeviceCodeMatch(deviceId, mpxPreferredCodes)) return true;
    return mpxModbusIds.has(Number(device?.modbus_id));
  };

  const getDeviceTelemetryTimestamp = (deviceId) => {
    const readings = (telemetryByDevice[deviceId] || []).filter((reading) => !isFallbackReading(reading));
    const lastFromReadings = readings
      .map((reading) => reading.captured_at)
      .filter(Boolean)
      .map((timestamp) => new Date(timestamp).getTime())
      .reduce((max, value) => Math.max(max, value), 0);
    if (lastFromReadings) return lastFromReadings;
    const overview = telemetryOverviewByDevice[deviceId];
    return overview?.last_telemetry_at ? toTimestamp(overview.last_telemetry_at) : null;
  };

  const getReading = (deviceId, code) => {
    const readings = telemetryByDevice[deviceId] || [];
    const normalized = resolveCode(code);
    return readings.find((reading) => resolveCode(reading.code) === normalized);
  };

  const getVariableMeta = (deviceId, code) => {
    const vars = deviceVarsMap[deviceId] || [];
    const normalized = resolveCode(code);
    return vars.find((item) => resolveCode(item.code) === normalized);
  };

  const getVariableUnit = (deviceId, code) => {
    const vars = deviceVarsMap[deviceId] || [];
    const normalized = resolveCode(code);
    const match = vars.find((item) => resolveCode(item.code) === normalized);
    return match?.measure_unit || match?.unit || '';
  };

  const getDefaultVariablesForDevice = (deviceId) => {
    const readings = telemetryByDevice[deviceId] || [];
    const preferredCodes = getPreferredCodesForDevice(deviceId);
    const preferredSet = preferredCodes ? new Set(preferredCodes.map(resolveCode)) : null;
    const importantSet = new Set(importantCodes.map(resolveCode));
    const filterByCodes = (list, codeSet) =>
      list.filter((item) => codeSet.has(resolveCode(item.code)));
    if (readings.length) {
      const filteredReadings = preferredSet
        ? filterByCodes(readings, preferredSet)
        : filterByCodes(readings, importantSet);
      const baseReadings = filteredReadings.length ? filteredReadings : readings;
      return baseReadings.slice(0, 4).map((reading) => ({
        variable_id: reading.variable_id,
        code: reading.code,
        label: getDisplayLabel(reading.label, reading.code),
        unit: reading.unit,
      }));
    }
    const vars = deviceVarsMap[deviceId] || [];
    if (vars.length) {
      const filteredVars = preferredSet
        ? filterByCodes(vars, preferredSet)
        : filterByCodes(vars, importantSet);
      const baseVars = filteredVars.length ? filteredVars : vars;
      return baseVars.slice(0, 4).map((variable) => ({
        variable_id: variable.id,
        code: variable.code,
        label: getDisplayLabel(variable.label, variable.code),
        unit: variable.measure_unit,
      }));
    }
    const fallbackCodes = preferredCodes || importantCodes;
    return fallbackCodes.map((code) => ({
      code,
      label: getDisplayLabel(null, code),
    }));
  };

  const getCardVariablesForDevice = (deviceId) => {
    const hasSavedVariables = Object.prototype.hasOwnProperty.call(dashboardVariables, deviceId);
    const displayVariables = dashboardVariables[deviceId] || [];
    const resolvedVariables = hasSavedVariables
      ? displayVariables
      : getDefaultVariablesForDevice(deviceId);
    return resolvedVariables.slice(0, 6);
  };

  const graphFallbackCodes = graphDeviceId
    ? getPreferredCodesForDevice(graphDeviceId)
    : skidPreferredCodes;
  const graphDefaultVariables = graphDeviceId
    ? getCardVariablesForDevice(graphDeviceId)
    : [];
  const graphAllVariables = graphDeviceId
    ? (deviceVarsMap[graphDeviceId] || [])
    : [];

  const getVariableIdForDevice = (deviceId, code, fallbackId) => {
    if (fallbackId) return fallbackId;
    const vars = deviceVarsMap[deviceId] || [];
    const normalized = resolveCode(code);
    const match = vars.find((variable) => resolveCode(variable.code) === normalized);
    return match?.id;
  };

  const applyLabelUpdate = (deviceId, variableId, code, nextLabel) => {
    setDeviceVarsMap((prev) => {
      const next = { ...prev };
      const list = next[deviceId];
      if (Array.isArray(list)) {
        next[deviceId] = list.map((variable) =>
          variable.id === variableId ? { ...variable, label: nextLabel } : variable
        );
      }
      return next;
    });
    setDashboardVariables((prev) => {
      const next = { ...prev };
      const list = next[deviceId];
      if (Array.isArray(list)) {
        next[deviceId] = list.map((variable) =>
          variable.variable_id === variableId ? { ...variable, label: nextLabel } : variable
        );
      }
      return next;
    });
    setDetailVariables((prev) =>
      prev.map((variable) =>
        variable.id === variableId ? { ...variable, label: nextLabel } : variable
      )
    );
    setTelemetryByDevice((prev) => {
      const next = { ...prev };
      const list = next[deviceId];
      if (Array.isArray(list)) {
        next[deviceId] = list.map((reading) =>
          resolveCode(reading.code) === resolveCode(code) ? { ...reading, label: nextLabel } : reading
        );
      }
      return next;
    });
  };

  const handleLabelContextMenu = async (event, deviceId, variable) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canEditLabels) return;
    const variableId = getVariableIdForDevice(deviceId, variable.code, variable.variable_id || variable.id);
    if (!variableId) return;
    const currentLabel = getDisplayLabel(variable.label, variable.code);
    const nextLabel = window.prompt('Novo nome da variavel', currentLabel);
    if (!nextLabel || nextLabel.trim() === currentLabel) return;
    const response = await fetchJson(`/api/devices/${deviceId}/variables/${variableId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: nextLabel.trim() }),
    });
    if (response?.status === 'ok') {
      applyLabelUpdate(deviceId, variableId, variable.code, nextLabel.trim());
    }
  };

  const resolveDeviceStatus = (device) => {
    const readings = (telemetryByDevice[device.id] || []).filter((reading) => !isFallbackReading(reading));
    const lastTelemetry = readings
      .map((reading) => reading.captured_at)
      .filter(Boolean)
      .map((timestamp) => new Date(timestamp).getTime())
      .reduce((max, value) => Math.max(max, value), 0);
    const lastSeenAt = device.last_seen_at ? new Date(device.last_seen_at).getTime() : 0;
    const lastTimestamp = Math.max(lastTelemetry, lastSeenAt);
    const isOnline = lastTimestamp > 0 && Date.now() - lastTimestamp < 15000;
    if (!isOnline) return 'offline';
    if (device.alarm_active) return 'alarm';
    return 'ok';
  };

  const normalizeText = (value) => (value || '').toString().toLowerCase();
  const visibleDevices = useMemo(() => {
    const query = normalizeText(deviceQuery);
    const filtered = plantDevices.filter((device) => {
      const status = resolveDeviceStatus(device);
      if (deviceStatusFilter !== 'all' && status !== deviceStatusFilter) return false;
      if (!query) return true;
      const haystack = [
        device.name,
        device.modbus_id,
        device.device_code,
        device.family_code,
        device.model_file,
      ]
        .filter(Boolean)
        .map((value) => normalizeText(value))
        .join(' ');
      return haystack.includes(query);
    });
    const sorted = [...filtered];
    if (deviceSortMode === 'address') {
      sorted.sort((a, b) => (a.modbus_id || 0) - (b.modbus_id || 0));
    } else if (deviceSortMode === 'az') {
      sorted.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)));
    }
    return sorted;
  }, [plantDevices, deviceQuery, deviceStatusFilter, deviceSortMode, telemetryByDevice]);

  const overviewAgeLabel = formatRelativeAge(telemetryOverviewUpdatedAt);
  const backendAgeLabel = formatRelativeAge(backendCheckedAt);
  const snapshotAgeLabel = formatRelativeAge(snapshotUpdatedAt);
  const backendPingLabel = Number.isFinite(backendPingMs) ? `${Math.round(backendPingMs)}ms` : null;
  const backendStatusLabel = backendProbeReady
    ? 'Banco online'
    : `Banco instavel (${backendReason || 'fallback ativo'})`;

  const getMiniWidgetMode = (deviceId) => miniWidgetModeByDevice[deviceId] || 'none';
  const isMiniGraphEnabled = (deviceId) => getMiniWidgetMode(deviceId) === 'graph';
  const isMiniAlarmEnabled = (deviceId) => getMiniWidgetMode(deviceId) === 'alarms';
  const normalizeMiniGraphSelection = useCallback((ids) => (
    (Array.isArray(ids) ? ids : [])
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .slice(0, 3)
  ), []);
  const upsertMiniGraphSelectionForDevice = useCallback((deviceId, ids) => {
    if (!deviceId) return [];
    const selected = normalizeMiniGraphSelection(ids);
    setMiniGraphVariableIdsByDevice((prev) => {
      const next = { ...prev };
      if (!selected.length) {
        delete next[deviceId];
      } else {
        next[deviceId] = selected;
      }
      return next;
    });
    return selected;
  }, [normalizeMiniGraphSelection]);
  const persistMiniGraphSelectionForDevice = useCallback(async (deviceId, ids) => {
    if (!deviceId) return false;
    const selected = normalizeMiniGraphSelection(ids);
    const response = await fetchJson(`/api/devices/${deviceId}/mini-graph-variables`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variable_ids: selected }),
    });
    return response?.status === 'ok';
  }, [normalizeMiniGraphSelection]);
  const getMiniGraphVariablesForDevice = (deviceId) => {
    const vars = deviceVarsMap[deviceId] || [];
    const selectedIds = (miniGraphVariableIdsByDevice[deviceId] || [])
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    if (selectedIds.length) {
      const byId = new Map(vars.map((variable) => [Number(variable.id), variable]));
      const selected = selectedIds
        .map((id) => byId.get(id))
        .filter(Boolean)
        .slice(0, 3);
      if (selected.length) return selected;
    }
    return getCardVariablesForDevice(deviceId).slice(0, 3);
  };
  const toggleMiniGraphForDevice = (deviceId) => {
    if (!deviceId) return;
    setMiniWidgetModeByDevice((prev) => {
      const current = prev[deviceId] || 'none';
      const nextMode = current === 'graph' ? 'none' : 'graph';
      const next = { ...prev };
      if (nextMode === 'none') {
        delete next[deviceId];
      } else {
        next[deviceId] = nextMode;
      }
      return next;
    });
  };
  const toggleMiniAlarmsForDevice = (deviceId) => {
    if (!deviceId) return;
    setMiniWidgetModeByDevice((prev) => {
      const current = prev[deviceId] || 'none';
      const nextMode = current === 'alarms' ? 'none' : 'alarms';
      const next = { ...prev };
      if (nextMode === 'none') {
        delete next[deviceId];
      } else {
        next[deviceId] = nextMode;
      }
      return next;
    });
  };

  const openVariableModal = async (deviceId) => {
    const response = await fetchJson(`/api/devices/${deviceId}/variables`);
    const variables = response?.data || [];
    const preferredCodes = getPreferredCodesForDevice(deviceId);
    const preferredSet = preferredCodes ? new Set(preferredCodes.map(resolveCode)) : null;
    const importantSet = new Set(importantCodes.map(resolveCode));
    const defaultSelections = variables
      .filter((variable) => (preferredSet ? preferredSet.has(resolveCode(variable.code)) : importantSet.has(resolveCode(variable.code))))
      .map((variable) => variable.id);
    const fallbackSelections = defaultSelections.length
      ? defaultSelections
      : variables.slice(0, 4).map((variable) => variable.id);
    const savedSelections = (dashboardVariables[deviceId] || [])
      .map((item) => item.variable_id)
      .filter((id) => variables.some((variable) => variable.id === id));
    const savedMiniSelections = (miniGraphVariableIdsByDevice[deviceId] || [])
      .map((value) => Number(value))
      .filter((id) => variables.some((variable) => variable.id === id));
    const hasSavedVariables = Object.prototype.hasOwnProperty.call(dashboardVariables, deviceId);
    const selectedDashboardIds = hasSavedVariables ? savedSelections : fallbackSelections;
    const fallbackMiniSelections = selectedDashboardIds.slice(0, 3);
    setSelectedDeviceId(deviceId);
    setDeviceVariables(variables);
    setSelectedVariableIds(selectedDashboardIds);
    setSelectedMiniGraphVariableIds(savedMiniSelections.length ? savedMiniSelections : fallbackMiniSelections);
    setIsMiniGraphVariablePickerOpen(false);
    const device = plantDevices.find((item) => item.id === deviceId);
    setDeviceNameDraft(device?.name || '');
    setIsVariableModalOpen(true);
  };

  const [detailDeviceId, setDetailDeviceId] = useState(null);
  const [detailVariables, setDetailVariables] = useState([]);
  const [detailReadings, setDetailReadings] = useState([]);
  const [detailReadingsPending, setDetailReadingsPending] = useState(false);

  const resolveBooleanState = (value) => {
    if (value === true) return true;
    if (value === false) return false;
    if (value === 1 || value === '1') return true;
    if (value === 0 || value === '0') return false;
    return null;
  };

  const isBooleanVariable = (deviceId, code, rawValue) => {
    const meta = getVariableMeta(deviceId, code);
    const functionCode = Number(meta?.function_code);
    if (functionCode === 1 || functionCode === 2) return true;
    return rawValue === true || rawValue === false;
  };

  const formatReadingValue = (deviceId, code, rawValue) => {
    if (rawValue === null || rawValue === undefined || Number.isNaN(rawValue)) return '--';
    if (isBooleanVariable(deviceId, code, rawValue)) {
      const state = resolveBooleanState(rawValue);
      if (state === null) return rawValue;
      return <span className={`boolean-dot ${state ? 'on' : 'off'}`} title={state ? 'Ligado' : 'Desligado'} />;
    }
    return rawValue;
  };

  const formatMiniValue = (value, unit = '') => formatChartReading(value, unit);

  const getSeriesScale = (series) => {
    if (!Array.isArray(series) || series.length === 0) return null;
    const values = series
      .map((point) => Number(point?.value))
      .filter((value) => Number.isFinite(value));
    if (!values.length) return null;
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const projectSeriesValueToY = (value, scale, height, padding = 4) => {
    if (!scale || !Number.isFinite(value)) return null;
    const span = scale.max - scale.min || 1;
    const ratio = (value - scale.min) / span;
    return height - padding - ratio * (height - padding * 2);
  };

  const getMiniChartRange = (deviceId, variables, seriesByCode) => {
    if (!Array.isArray(variables) || variables.length === 0) {
      if (deviceId !== null && deviceId !== undefined) {
        delete miniRangeRef.current[String(deviceId)];
      }
      return null;
    }
    let minTime = Number.POSITIVE_INFINITY;
    let maxTime = Number.NEGATIVE_INFINITY;
    variables.forEach((variable) => {
      const normalized = resolveCode(variable.code);
      const series = Array.isArray(seriesByCode?.[normalized]) ? seriesByCode[normalized] : [];
      if (!series.length) return;
      const first = Number(series[0]?.t);
      const last = Number(series[series.length - 1]?.t);
      if (!Number.isFinite(first) || !Number.isFinite(last)) return;
      minTime = Math.min(minTime, first);
      maxTime = Math.max(maxTime, last);
    });
    if (!Number.isFinite(minTime) || !Number.isFinite(maxTime)) {
      if (deviceId !== null && deviceId !== undefined) {
        delete miniRangeRef.current[String(deviceId)];
      }
      return null;
    }
    const deviceKey = String(deviceId);
    const previousRange = miniRangeRef.current[deviceKey];
    const range = buildSharedTimeRange({
      minTime,
      maxTime,
      previousRange,
      historyFillRatio: chartHistoryFillRatio,
      minRealtimeSpanMs: 1500,
      startupSpanMs: 45000,
    });
    if (!range) return null;
    miniRangeRef.current[deviceKey] = { start: range.start, end: range.end };
    return { start: range.start, end: range.end, realtimeStart: range.realtimeStart };
  };

  const buildSparklinePath = (series, range, width, height, padding = 4) => {
    if (!Array.isArray(series) || series.length === 0) return '';
    const scale = getSeriesScale(series);
    if (!scale) return '';
    const fallbackStart = Number(series[0]?.t);
    const fallbackEnd = Number(series[series.length - 1]?.t);
    const start = Number.isFinite(range?.start) ? range.start : fallbackStart;
    const end = Number.isFinite(range?.end) ? range.end : fallbackEnd;
    if (!Number.isFinite(start) || !Number.isFinite(end)) return '';
    const timeSpan = end - start || 1;
    const coordinates = series
      .map((point) => {
        const t = Number(point?.t);
        const value = Number(point?.value);
        if (!Number.isFinite(t) || !Number.isFinite(value)) return null;
        const ratio = Math.max(0, Math.min(1, (t - start) / timeSpan));
        const x = padding + ratio * (width - padding * 2);
        const y = projectSeriesValueToY(value, scale, height, padding);
        if (!Number.isFinite(y)) return null;
        return { x, y };
      })
      .filter(Boolean);
    if (!coordinates.length) return '';
    if (coordinates.length === 1) {
      const point = coordinates[0];
      const endX = Math.min(width - padding, point.x + 2.5);
      return `M${point.x.toFixed(2)},${point.y.toFixed(2)} L${endX.toFixed(2)},${point.y.toFixed(2)}`;
    }
    return coordinates
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(' ');
  };

  const getSparklinePointY = (series, targetTimestamp, height = 60, padding = 4) => {
    if (!Array.isArray(series) || series.length === 0) return null;
    const scale = getSeriesScale(series);
    if (!scale) return null;
    const value = interpolateSeriesValueAt(series, targetTimestamp);
    if (!Number.isFinite(value)) return null;
    return projectSeriesValueToY(value, scale, height, padding);
  };

  const handleMiniChartHoverMove = (event, deviceId, variables, seriesByCode, chartRange) => {
    if (!Array.isArray(variables) || variables.length === 0) {
      setMiniChartHover((prev) => (prev?.deviceId === deviceId ? null : prev));
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;
    const cardElement = miniCardRefs.current[deviceId];
    if (!cardElement) return;
    const cardRect = cardElement.getBoundingClientRect();
    if (!cardRect.width || !cardRect.height) return;
    const pointerX = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    const ratio = Math.max(0, Math.min(1, pointerX / bounds.width));
    const roundedRatio = Math.round(ratio * 1000) / 1000;
    const effectiveRange = chartRange || getMiniChartRange(deviceId, variables, seriesByCode);
    if (!effectiveRange) {
      setMiniChartHover((prev) => (prev?.deviceId === deviceId ? null : prev));
      return;
    }
    const targetTimestamp = effectiveRange.start + (effectiveRange.end - effectiveRange.start) * roundedRatio;
    const xSvg = 4 + roundedRatio * (160 - 8);
    const points = variables.map((variable, index) => {
      const normalized = resolveCode(variable.code);
      const series = Array.isArray(seriesByCode[normalized]) ? seriesByCode[normalized] : [];
      if (!series.length) return null;
      const value = interpolateSeriesValueAt(series, targetTimestamp);
      if (!Number.isFinite(value)) return null;
      const y = getSparklinePointY(series, targetTimestamp, 60, 4);
      if (!Number.isFinite(y)) return null;
      const fallbackUnit = getVariableUnit(deviceId, variable.code);
      const displayUnit = resolveUnit(variable.code, variable.unit || fallbackUnit);
      return {
        code: normalized,
        label: getDisplayLabel(variable.label, variable.code),
        value,
        unit: displayUnit,
        y,
        color: miniGraphColors[index % miniGraphColors.length],
      };
    }).filter(Boolean);
    if (!points.length) {
      setMiniChartHover((prev) => (prev?.deviceId === deviceId ? null : prev));
      return;
    }
    const toLocalRect = (rect) => ({
      left: rect.left - cardRect.left,
      top: rect.top - cardRect.top,
      right: rect.right - cardRect.left,
      bottom: rect.bottom - cardRect.top,
    });
    const expandRect = (rect, padding = 4) => ({
      left: rect.left - padding,
      top: rect.top - padding,
      right: rect.right + padding,
      bottom: rect.bottom + padding,
    });
    const intersectionArea = (leftRect, rightRect) => {
      const left = Math.max(leftRect.left, rightRect.left);
      const top = Math.max(leftRect.top, rightRect.top);
      const right = Math.min(leftRect.right, rightRect.right);
      const bottom = Math.min(leftRect.bottom, rightRect.bottom);
      if (right <= left || bottom <= top) return 0;
      return (right - left) * (bottom - top);
    };
    const titleElement = miniTitleRefs.current[deviceId];
    const leftColumnElement = miniLeftRefs.current[deviceId];
    const blockedRects = [];
    if (titleElement) {
      blockedRects.push(expandRect(toLocalRect(titleElement.getBoundingClientRect()), 4));
    }
    if (leftColumnElement) {
      blockedRects.push(expandRect(toLocalRect(leftColumnElement.getBoundingClientRect()), 4));
    }
    const safePadding = 6;
    const tooltipWidth = Math.max(136, Math.min(196, cardRect.width - safePadding * 2));
    const tooltipHeight = 10 + points.length * 20;
    const diagonalOffset = Math.SQRT1_2 * 20;
    const tooltipGap = 6;
    const mouseAnchorX = Math.max(safePadding, Math.min(cardRect.width - safePadding, event.clientX - cardRect.left));
    const mouseAnchorY = Math.max(safePadding, Math.min(cardRect.height - safePadding, event.clientY - cardRect.top));
    const candidates = [
      { key: 'down-right', dirX: 1, dirY: 1 },
      { key: 'down-left', dirX: -1, dirY: 1 },
      { key: 'up-right', dirX: 1, dirY: -1 },
      { key: 'up-left', dirX: -1, dirY: -1 },
    ].map((candidate) => {
      const lineEndX = mouseAnchorX + candidate.dirX * diagonalOffset;
      const lineEndY = mouseAnchorY + candidate.dirY * diagonalOffset;
      const tooltipLeft = candidate.dirX > 0
        ? lineEndX + tooltipGap
        : lineEndX - tooltipWidth - tooltipGap;
      const tooltipTop = candidate.dirY > 0
        ? lineEndY + tooltipGap
        : lineEndY - tooltipHeight - tooltipGap;
      const tooltipRect = {
        left: tooltipLeft,
        top: tooltipTop,
        right: tooltipLeft + tooltipWidth,
        bottom: tooltipTop + tooltipHeight,
      };
      const overflowX = Math.max(0, safePadding - tooltipRect.left) + Math.max(0, tooltipRect.right - (cardRect.width - safePadding));
      const overflowY = Math.max(0, safePadding - tooltipRect.top) + Math.max(0, tooltipRect.bottom - (cardRect.height - safePadding));
      const collisionPenalty = blockedRects.reduce((total, blockedRect) => (
        total + intersectionArea(tooltipRect, blockedRect)
      ), 0);
      const score = overflowX * 80 + overflowY * 80 + collisionPenalty;
      return {
        ...candidate,
        lineEndX,
        lineEndY,
        tooltipLeft,
        tooltipTop,
        tooltipRect,
        overflowX,
        overflowY,
        collisionPenalty,
        score,
      };
    });
    const validCandidate = candidates.find((candidate) =>
      candidate.overflowX === 0 && candidate.overflowY === 0 && candidate.collisionPenalty === 0);
    const selectedCandidate = validCandidate
      || candidates.reduce((best, candidate) => (candidate.score < best.score ? candidate : best), candidates[0]);
    const clampedTooltipLeft = Math.max(
      safePadding,
      Math.min(cardRect.width - safePadding - tooltipWidth, selectedCandidate.tooltipLeft),
    );
    const clampedTooltipTop = Math.max(
      safePadding,
      Math.min(cardRect.height - safePadding - tooltipHeight, selectedCandidate.tooltipTop),
    );
    setMiniChartHover({
      deviceId,
      ratio: roundedRatio,
      xSvg,
      cardWidth: cardRect.width,
      cardHeight: cardRect.height,
      mouseAnchorX,
      mouseAnchorY,
      connectorEndX: selectedCandidate.lineEndX,
      connectorEndY: selectedCandidate.lineEndY,
      tooltipLeft: clampedTooltipLeft,
      tooltipTop: clampedTooltipTop,
      tooltipWidth,
      points,
    });
  };

  const handleMiniChartHoverLeave = (deviceId) => {
    setMiniChartHover((prev) => (prev?.deviceId === deviceId ? null : prev));
  };

  const fixedAlarmCodesByDevice = useMemo(() => {
    const map = {};
    plantDevices.forEach((device) => {
      const fixedCodes = getFixedAlarmCodesForModel(device);
      if (!fixedCodes || !fixedCodes.size) return;
      map[device.id] = fixedCodes;
    });
    return map;
  }, [plantDevices]);

  const alarmKeywordPattern = /(alarm|alarme|alerta|alert|fault|falha|erro|error|trip|defeito|defrost|shutdown|stop)/i;
  const alarmCodePattern = /(alm|alarm|alrm|aler|alert|fault|fail|erro|err|trip|def|shutdown|stop)/i;
  const alarmCodeExclusions = new Set(['al', 'ah']);

  const isAlarmMeta = (deviceId, variable) => {
    if (!variable) return false;
    const normalized = resolveCode(variable.code);
    if (!normalized || alarmCodeExclusions.has(normalized)) return false;
    const fixedCodes = fixedAlarmCodesByDevice[deviceId];
    if (fixedCodes?.size) {
      return fixedCodes.has(normalized);
    }
    const label = `${variable.label || ''} ${variable.description || ''} ${variable.group || ''} ${variable.category || ''} ${variable.kind || ''}`;
    if (alarmKeywordPattern.test(label)) return true;
    return alarmCodePattern.test(normalized);
  };

  const isReadingRealtime = (reading) => {
    if (!reading || isFallbackReading(reading)) return false;
    const status = String(reading?.status || '').toLowerCase();
    if (status && status !== 'good' && status !== 'ok' && status !== 'success') return false;
    return true;
  };

  const isAlarmReading = (deviceId, reading) => {
    if (!reading) return false;
    if (reading?.alarm === true || reading?.alarm_active === true || reading?.is_alarm === true) return true;
    const normalized = resolveCode(reading.code);
    if (!normalized || alarmCodeExclusions.has(normalized)) return false;
    const fixedCodes = fixedAlarmCodesByDevice[deviceId];
    if (fixedCodes?.size) {
      return fixedCodes.has(normalized);
    }
    const meta = getVariableMeta(deviceId, reading.code);
    if (meta && isAlarmMeta(deviceId, meta)) return true;
    if (alarmKeywordPattern.test(reading?.label || '')) return true;
    return alarmCodePattern.test(normalized);
  };

  const isAlarmActive = (reading) => {
    const rawValue = reading?.value;
    if (rawValue === null || rawValue === undefined) return false;
    if (typeof rawValue === 'boolean') return rawValue;
    if (typeof rawValue === 'number') return rawValue > 0;
    const text = String(rawValue).trim().toLowerCase();
    if (!text) return false;
    if (['true', 'on', 'ativo', '1', 'yes', 'alarm', 'alarme', 'fault', 'erro', 'trip'].includes(text)) return true;
    if (['false', 'off', 'inativo', '0', 'no', 'ok', 'normal'].includes(text)) return false;
    const parsed = Number(text.replace(',', '.'));
    if (Number.isFinite(parsed)) return parsed > 0;
    return true;
  };

  const getMiniAlarmEntries = (deviceId) => {
    const readings = telemetryByDevice[deviceId] || [];
    const realtimeReadings = readings.filter(isReadingRealtime);
    if (!realtimeReadings.length) {
      return { state: 'waiting', items: [] };
    }
    const alarmReadings = realtimeReadings.filter((reading) => isAlarmReading(deviceId, reading));
    const activeReadings = alarmReadings.filter(isAlarmActive);
    if (!activeReadings.length) {
      return { state: 'none', items: [] };
    }
    const items = activeReadings.map((reading) => {
      const fallbackUnit = getVariableUnit(deviceId, reading.code);
      const displayUnit = resolveUnit(reading.code, reading.unit || fallbackUnit);
      return {
        code: reading.code,
        label: getDisplayLabel(reading.label, reading.code),
        value: formatReadingValue(deviceId, reading.code, reading.value),
        unit: displayUnit,
        capturedAt: reading.captured_at,
      };
    });
    return { state: 'active', items };
  };

  const getReadingLatencyMs = (reading) => {
    const raw = reading?.response_ms ?? reading?.elapsed_ms ?? reading?.latency_ms ?? reading?.duration_ms ?? reading?.responseMs;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  };

  const summarizeSamples = (samples) => {
    if (!Array.isArray(samples) || samples.length === 0) return null;
    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((total, value) => total + value, 0);
    const p95Index = Math.max(0, Math.floor(count * 0.95) - 1);
    return {
      count,
      last: samples[samples.length - 1],
      min: sorted[0],
      max: sorted[count - 1],
      avg: sum / count,
      p95: sorted[p95Index],
    };
  };

  const formatMs = (value) => (Number.isFinite(value) ? `${Math.round(value)} ms` : '--');
  const formatBitrate = (value) => {
    if (!Number.isFinite(value) || value < 0) return '--';
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} Mbps`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)} Kbps`;
    return `${Math.round(value)} bps`;
  };
  const formatBytes = (value) => {
    if (!Number.isFinite(value) || value < 0) return '--';
    if (value >= 1024 * 1024 * 1024) return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
    if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${Math.round(value)} B`;
  };

  useEffect(() => {
    Object.entries(telemetryByDevice).forEach(([deviceId, readings]) => {
      if (!Array.isArray(readings)) return;
      readings.forEach((reading) => {
        if (!isReadingRealtime(reading)) return;
        const latency = getReadingLatencyMs(reading);
        if (!Number.isFinite(latency)) return;
        const normalized = resolveCode(reading?.code);
        if (!normalized) return;
        const signature = `${reading?.captured_at || ''}:${reading?.value ?? ''}:${latency}`;
        const key = `${deviceId}:${normalized}`;
        const lastSeen = diagnosticsRef.current.variableLastSeen[key];
        if (signature && signature === lastSeen) return;
        diagnosticsRef.current.variableLastSeen[key] = signature;
        recordVariableLatency(deviceId, reading, latency);
      });
    });
  }, [telemetryByDevice]);

  const diagnosticsSnapshot = useMemo(() => {
    const store = diagnosticsRef.current;
    const refreshStats = summarizeSamples(store.realtimeRefresh);
    const telemetryStats = summarizeSamples(store.telemetryRealtime);
    const overviewStats = summarizeSamples(store.overviewFetch);
    const networkDownStats = summarizeSamples(store.networkDownBps);
    const networkUpStats = summarizeSamples(store.networkUpBps);
    const deviceStats = Object.entries(store.deviceRealtime || {})
      .map(([deviceId, samples]) => ({
        deviceId: Number(deviceId),
        stats: summarizeSamples(samples),
      }))
      .filter((entry) => entry.stats);
    deviceStats.sort((a, b) => (b.stats?.avg || 0) - (a.stats?.avg || 0));
    const variableStats = Object.entries(store.variableLatency || {})
      .map(([key, samples]) => {
        const meta = store.variableMeta[key] || {};
        const [deviceId, code] = key.split(':');
        return {
          deviceId: Number(meta.deviceId ?? deviceId),
          code: meta.code || code,
          label: meta.label,
          stats: summarizeSamples(samples),
        };
      })
      .filter((entry) => entry.stats);
    variableStats.sort((a, b) => (b.stats?.avg || 0) - (a.stats?.avg || 0));
    const serverStats = deviceStats.length
      ? summarizeSamples(deviceStats.map((entry) => entry.stats?.avg).filter(Number.isFinite))
      : telemetryStats;
    return {
      updatedAt: store.lastUpdatedAt,
      refreshStats,
      telemetryStats,
      overviewStats,
      networkStats: {
        down: networkDownStats,
        up: networkUpStats,
        totalDownBytes: Number(store.networkTotalDownBytes || 0),
        totalUpBytes: Number(store.networkTotalUpBytes || 0),
      },
      deviceStats,
      variableStats,
      serverStats,
    };
  }, [diagnosticsTick]);

  const diagnosticDeviceRows = useMemo(() => (
    (diagnosticsSnapshot?.deviceStats || []).map((entry) => {
      const device = deviceById[entry.deviceId];
      return {
        id: entry.deviceId,
        name: device?.name || `Device ${entry.deviceId}`,
        avg: entry.stats?.avg,
        p95: entry.stats?.p95,
        last: entry.stats?.last,
      };
    })
  ), [diagnosticsSnapshot, deviceById]);

  const diagnosticVariableRows = useMemo(() => (
    (diagnosticsSnapshot?.variableStats || []).map((entry) => {
      const label = entry.label || getVariableMeta(entry.deviceId, entry.code)?.label;
      return {
        key: `${entry.deviceId}-${entry.code}`,
        deviceName: deviceById[entry.deviceId]?.name || `Device ${entry.deviceId}`,
        code: entry.code,
        label: getDisplayLabel(label, entry.code),
        avg: entry.stats?.avg,
        p95: entry.stats?.p95,
        last: entry.stats?.last,
      };
    })
  ), [diagnosticsSnapshot, deviceById, deviceVarsMap]);

  useEffect(() => {
    if (!isDiagnosticsOpen) return undefined;
    const handleClickOutside = (event) => {
      const panel = diagnosticPanelRef.current;
      if (!panel) return;
      if (panel.contains(event.target)) return;
      setIsDiagnosticsOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      setIsDiagnosticsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDiagnosticsOpen]);

  const openDeviceDetail = async (deviceId) => {
    const response = await fetchJson(`/api/devices/${deviceId}/variables`);
    setDetailVariables(response?.data || []);
    setDetailDeviceId(deviceId);
    setDetailReadingsPending(true);
    try {
      const readingsResponse = await fetchJson(`/api/devices/${deviceId}/readings`);
      setDetailReadings(readingsResponse?.readings || readingsResponse?.latest || []);
    } finally {
      setDetailReadingsPending(false);
    }
  };

  const handleSaveDashboardVariables = async () => {
    if (!selectedDeviceId) return;
    setSaveVariablesPending(true);
    const response = await fetchJson(`/api/devices/${selectedDeviceId}/dashboard-variables`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variable_ids: selectedVariableIds }),
    });
    if (response?.status === 'ok') {
      const updatedRows = deviceVariables
        .filter((variable) => selectedVariableIds.includes(variable.id))
        .map((variable) => ({
          variable_id: variable.id,
          code: variable.code,
          label: variable.label,
        }));
      setDashboardVariables((prev) => ({
        ...prev,
        [selectedDeviceId]: updatedRows,
      }));
      const normalizedMini = upsertMiniGraphSelectionForDevice(selectedDeviceId, selectedMiniGraphVariableIds);
      void persistMiniGraphSelectionForDevice(selectedDeviceId, normalizedMini);
      setIsVariableModalOpen(false);
    }
    setSaveVariablesPending(false);
  };

  const handleSaveDeviceName = async () => {
    if (!selectedDeviceId || !canEditDeviceName) return;
    setSaveDeviceNamePending(true);
    const normalizedName = String(deviceNameDraft || '').trim();
    if (!normalizedName) {
      setSaveDeviceNamePending(false);
      return;
    }
    const response = await fetchJson(`/api/devices/${selectedDeviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: normalizedName }),
    });
    if (response?.status === 'ok') {
      setDeviceNameOverrides((prev) => ({ ...prev, [selectedDeviceId]: normalizedName }));
      setDeviceNameDraft(normalizedName);
      void refresh({ background: true });
    }
    setSaveDeviceNamePending(false);
  };

  const toggleVariableSelection = (variableId) => {
    setSelectedVariableIds((prev) => {
      if (prev.includes(variableId)) {
        return prev.filter((item) => item !== variableId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, variableId];
    });
  };

  const toggleMiniGraphVariableSelection = (variableId) => {
    if (!selectedDeviceId) return;
    const current = selectedMiniGraphVariableIds;
    let next;
    if (current.includes(variableId)) {
      next = current.filter((item) => item !== variableId);
    } else if (current.length >= 3) {
      next = current;
    } else {
      next = [...current, variableId];
    }
    const normalized = normalizeMiniGraphSelection(next);
    setSelectedMiniGraphVariableIds(normalized);
    upsertMiniGraphSelectionForDevice(selectedDeviceId, normalized);
    void persistMiniGraphSelectionForDevice(selectedDeviceId, normalized);
  };

  const closeVariableModal = useCallback(() => {
    if (selectedDeviceId) {
      const normalizedMini = upsertMiniGraphSelectionForDevice(selectedDeviceId, selectedMiniGraphVariableIds);
      void persistMiniGraphSelectionForDevice(selectedDeviceId, normalizedMini);
    }
    setIsMiniGraphVariablePickerOpen(false);
    setIsVariableModalOpen(false);
  }, [
    selectedDeviceId,
    selectedMiniGraphVariableIds,
    upsertMiniGraphSelectionForDevice,
    persistMiniGraphSelectionForDevice,
  ]);

  const handleRwInputChange = (code, value) => {
    setRwInputs((prev) => ({ ...prev, [code]: value }));
    setRwStatus((prev) => ({ ...prev, [code]: null }));
  };

  const handleWriteVariable = async (code) => {
    if (!selectedDeviceId) return;
    const rawValue = String(rwInputs[code] || '').trim();
    if (!rawValue) {
      setRwStatus((prev) => ({ ...prev, [code]: { status: 'error', message: 'Valor vazio' } }));
      return;
    }
    setRwStatus((prev) => ({ ...prev, [code]: { status: 'pending', message: 'Enviando...' } }));
    const response = await fetchJson(`/api/devices/${selectedDeviceId}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, value: rawValue }),
    });
    if (response?.status === 'ok') {
      setRwStatus((prev) => ({ ...prev, [code]: { status: 'success', message: 'Aplicado' } }));
      setRwInputs((prev) => ({ ...prev, [code]: '' }));
    } else {
      setRwStatus((prev) => ({ ...prev, [code]: { status: 'error', message: 'Falha ao escrever' } }));
    }
  };

  if (loading) {
    const loadingLabel = 'Carregando dados da planta...';
    return (
      <main className="page">
        <div className="telemetry-loading" role="status" aria-live="polite">
          <div className="telemetry-loading-card">
            <div className="telemetry-loading-bar"><span /></div>
            <strong>Carregando</strong>
            <span className="micro muted">{loadingLabel}</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="panel">
        {!activePlant && (
          <div className="empty-state">
            <p className="muted">Nenhuma planta cadastrada. Use o scanner para iniciar a coleta.</p>
          </div>
        )}
        <div className="panel-header">
          <div>
            <p className="eyebrow">Planta em foco</p>
            <h2>{activePlant?.name || 'Sem plantas cadastradas'}</h2>
          </div>
          <div className="panel-actions">
            <select
              className="select"
              value={activePlant?.id || ''}
              onChange={(e) => onSelectPlant(Number(e.target.value))}
            >
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
            <div className={`badge ${activePlant?.status}`}>{activePlant?.status || 'n/d'}</div>
          </div>
        </div>
        <div className="toolbar">
          <div className="micro muted">
            Hostname: {activePlant?.hostname} • VPN: {activePlant?.vpn_tunnel} • {backendStatusLabel}
            {backendAgeLabel ? ` • check ${backendAgeLabel}` : ''}
            {backendPingLabel ? ` • ping ${backendPingLabel}` : ''}
            {!backendProbeReady && snapshotAgeLabel ? ` • snapshot ${snapshotAgeLabel}` : ''}
          </div>
          <div className="toolbar-actions">
            {!telemetryReady && <span className="micro muted">Aguardando leituras reais...</span>}
            {(refreshing || isRealtimeRefreshing) && <span className="micro muted">Atualizando em tempo real...</span>}
            {!backendProbeReady && <span className="micro muted">Fallback ativo</span>}
            {!backendReady && <span className="micro muted">DB em recuperacao</span>}
            <button
              type="button"
              className="ghost"
              onClick={handleRealtimeRefresh}
              disabled={isRealtimeRefreshing}
            >
              Recarregar dados
            </button>
            <button
              type="button"
              className={`ghost ${isDiagnosticsOpen ? 'active' : ''}`}
              onClick={() => setIsDiagnosticsOpen((prev) => !prev)}
            >
              Diagnostico
            </button>
          </div>
        </div>
        <div className="device-toolbar">
          <div className="device-toolbar-left">
            <input
              className="device-search"
              type="search"
              placeholder="Buscar device"
              value={deviceQuery}
              onChange={(event) => setDeviceQuery(event.target.value)}
            />
            <select
              className="select"
              value={deviceStatusFilter}
              onChange={(event) => setDeviceStatusFilter(event.target.value)}
            >
              <option value="all">Todos</option>
              <option value="ok">On-line</option>
              <option value="alarm">Alarme</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="device-toolbar-right">
            <button
              type="button"
              className={`ghost compact ${deviceSortMode === 'address' ? 'active' : ''}`}
              onClick={() => setDeviceSortMode('address')}
            >
              Endereco
            </button>
            <button
              type="button"
              className={`ghost compact ${deviceSortMode === 'az' ? 'active' : ''}`}
              onClick={() => setDeviceSortMode('az')}
            >
              A/Z
            </button>
            <button
              type="button"
              className={`ghost compact ${deviceLayoutMode === 'list' ? 'active' : ''}`}
              onClick={() => setDeviceLayoutMode('list')}
            >
              Lista
            </button>
            <button
              type="button"
              className={`ghost compact ${deviceLayoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => setDeviceLayoutMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
        {plantDevices.length === 0 && (
          <div className="empty-state">
            <p className="muted">Nenhum dispositivo encontrado. Execute o scanner para carregar dados reais.</p>
          </div>
        )}
        {plantDevices.length > 0 && visibleDevices.length === 0 && (
          <div className="empty-state">
            <p className="muted">Nenhum dispositivo corresponde aos filtros atuais.</p>
          </div>
        )}
        <div className={`device-grid ${deviceLayoutMode === 'list' ? 'device-grid-list' : 'device-grid-compact'}`}>
          {visibleDevices.map((device) => {
            const status = resolveDeviceStatus(device);
            const asset = deviceAssets[device.id];
            const hasSavedVariables = Object.prototype.hasOwnProperty.call(dashboardVariables, device.id);
            const miniVariables = getCardVariablesForDevice(device.id);
            const miniWidgetMode = getMiniWidgetMode(device.id);
            const showMiniGraph = miniWidgetMode === 'graph';
            const showMiniAlarms = miniWidgetMode === 'alarms';
            const hasMiniWidget = showMiniGraph || showMiniAlarms;
            const miniGraphVariables = showMiniGraph ? getMiniGraphVariablesForDevice(device.id) : [];
            const miniSeriesByCode = miniSeriesByDevice[device.id] || {};
            const miniChartRange = showMiniGraph ? getMiniChartRange(device.id, miniGraphVariables, miniSeriesByCode) : null;
            const miniHoverState = miniChartHover?.deviceId === device.id ? miniChartHover : null;
            const miniAlarmState = showMiniAlarms ? getMiniAlarmEntries(device.id) : null;
            const miniTitle = formatMiniatureTitle(device.name);
            return (
              <article
                key={device.id}
                className="card device-mini-card"
                ref={(node) => {
                  if (node) miniCardRefs.current[device.id] = node;
                  else delete miniCardRefs.current[device.id];
                }}
              >
                <header
                  className="device-mini-title"
                  title={device.name}
                  ref={(node) => {
                    if (node) miniTitleRefs.current[device.id] = node;
                    else delete miniTitleRefs.current[device.id];
                  }}
                >
                  <h3>{miniTitle}</h3>
                  <div className="device-mini-title-actions">
                    <button
                      type="button"
                      className="ghost compact device-mini-settings-btn"
                      title="Detalhes do device"
                      aria-label={`Abrir detalhes de ${device.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openDeviceDetail(device.id);
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path
                          fill="currentColor"
                          d="M19.14 12.94a7.43 7.43 0 0 0 .05-.94 7.43 7.43 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.32 7.32 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.13.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.43 7.43 0 0 0-.05.94c0 .32.02.63.05.94L2.83 14.2a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.4 1.05.71 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.23 1.13-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
                        />
                      </svg>
                    </button>
                  </div>
                </header>
                <div className="device-mini-body">
                  <div className={`device-mini-top ${hasMiniWidget ? '' : 'solo'}`}>
                    <div
                      className={`device-mini-left ${isMpxDevice(device.id) ? 'with-state' : ''}`}
                      ref={(node) => {
                        if (node) miniLeftRefs.current[device.id] = node;
                        else delete miniLeftRefs.current[device.id];
                      }}
                    >
                      <div className={`device-mini-icon device-status-${status}`}>
                        <div className="device-icon">
                          <img src={asset?.image_path || '/images/pCO.png'} alt={asset?.image_key || 'device'} />
                        </div>
                      </div>
                      {isMpxDevice(device.id) && (
                        <div className="device-mini-state device-mini-state-below">
                          <span className="micro muted">Ligado</span>
                          <span className={`status-dot ${status === 'offline' ? 'off' : 'on'}`} />
                        </div>
                      )}
                    </div>
                    {showMiniGraph && (
                      <div
                        className="device-mini-chart enabled open-graph"
                        role="button"
                        tabIndex={0}
                        title="Abrir grafico"
                        onClick={(event) => {
                          event.stopPropagation();
                          setGraphViewMode('main');
                          setGraphDeviceId(device.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return;
                          event.preventDefault();
                          event.stopPropagation();
                          setGraphViewMode('main');
                          setGraphDeviceId(device.id);
                        }}
                      >
                        <div className="mini-chart-header">
                          <span className="micro muted">Live</span>
                          <span className="mini-chart-open-link">Abrir grafico</span>
                        </div>
                        <div
                          className="mini-chart-canvas"
                          onMouseMove={(event) => handleMiniChartHoverMove(
                            event,
                            device.id,
                            miniGraphVariables,
                            miniSeriesByCode,
                            miniChartRange,
                          )}
                          onMouseLeave={() => handleMiniChartHoverLeave(device.id)}
                        >
                          <svg className="mini-chart-svg" viewBox="0 0 160 60" preserveAspectRatio="none" aria-hidden="true">
                            {miniGraphVariables.map((variable, index) => {
                              const normalized = resolveCode(variable.code);
                              const series = miniSeriesByCode[normalized] || [];
                              const path = buildSparklinePath(series, miniChartRange, 160, 60, 4);
                              const color = miniGraphColors[index % miniGraphColors.length];
                              return path ? (
                                <path key={normalized} d={path} stroke={color} strokeWidth="2" fill="none" />
                              ) : null;
                            })}
                            {miniHoverState && (
                              <line
                                className="mini-chart-crosshair"
                                x1={miniHoverState.xSvg}
                                y1="4"
                                x2={miniHoverState.xSvg}
                                y2="56"
                              />
                            )}
                            {miniHoverState?.points?.map((point) => (
                              <circle
                                key={`${device.id}-${point.code}-hover`}
                                className="mini-chart-hover-point"
                                cx={miniHoverState.xSvg}
                                cy={point.y}
                                r="3.2"
                                fill={point.color}
                              />
                            ))}
                          </svg>
                        </div>
                      </div>
                    )}
                    {showMiniAlarms && (
                      <div className="device-mini-alarms">
                        <div className="mini-alarms-header">
                          <span className="micro muted">Alarmes</span>
                          <span className={`mini-alarms-count ${miniAlarmState?.state === 'active' ? 'active' : ''}`}>
                            {miniAlarmState?.items?.length || 0}
                          </span>
                        </div>
                        <div className="mini-alarms-list">
                          {miniAlarmState?.state === 'waiting' && (
                            <span className="mini-alarms-empty">Aguardando leitura real...</span>
                          )}
                          {miniAlarmState?.state === 'none' && (
                            <span className="mini-alarms-empty">Sem alarmes ativos</span>
                          )}
                          {miniAlarmState?.state === 'active' && miniAlarmState.items.map((entry) => (
                            <div key={`${device.id}-${entry.code}-${entry.label}`} className="mini-alarms-item">
                              <span className="mini-alarms-label" title={entry.label}>{entry.label}</span>
                              <span className="mini-alarms-value">{entry.value} {entry.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="device-mini-values">
                    {miniVariables.length === 0 && hasSavedVariables && (
                      <span className="micro muted">Sem variaveis selecionadas.</span>
                    )}
                    {miniVariables.map((variable) => {
                      const reading = getReading(device.id, variable.code);
                      const displayValue = formatReadingValue(device.id, variable.code, reading?.value);
                      const fallbackUnit = getVariableUnit(device.id, variable.code);
                      const displayUnit = resolveUnit(variable.code, reading?.unit || variable.unit || fallbackUnit);
                      return (
                        <div key={`${device.id}-${variable.code}`} className="device-mini-value">
                          <span
                            title={canEditLabels ? 'Botao direito para alterar' : undefined}
                            onContextMenu={
                              canEditLabels
                                ? (event) => handleLabelContextMenu(event, device.id, variable)
                                : undefined
                            }
                          >
                            {getDisplayLabel(variable.label, variable.code)}
                          </span>
                          <strong>{displayValue} {displayUnit}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {showMiniGraph && miniHoverState && (
                  <div className="mini-chart-hover-layer" aria-hidden="true">
                    <svg
                      className="mini-chart-hover-connector"
                      viewBox={`0 0 ${miniHoverState.cardWidth} ${miniHoverState.cardHeight}`}
                      preserveAspectRatio="none"
                    >
                      <line
                        className="mini-chart-hover-link"
                        x1={miniHoverState.mouseAnchorX}
                        y1={miniHoverState.mouseAnchorY}
                        x2={miniHoverState.connectorEndX}
                        y2={miniHoverState.connectorEndY}
                      />
                    </svg>
                    <div
                      className="mini-chart-hover-tooltip floating"
                      style={{
                        left: `${miniHoverState.tooltipLeft}px`,
                        top: `${miniHoverState.tooltipTop}px`,
                        width: `${miniHoverState.tooltipWidth}px`,
                      }}
                    >
                      {miniHoverState.points.map((point) => (
                        <div key={`${device.id}-${point.code}-tip`} className="mini-chart-hover-row">
                          <span className="mini-chart-hover-label">
                            <span className="mini-chart-dot" style={{ background: point.color }} />
                            {point.label}
                          </span>
                          <strong>{formatMiniValue(point.value, point.unit)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <div className="grid two-col">
          <article className="card highlight">
            <div className="tag">Alarmes</div>
            <h3>Últimos eventos</h3>
            {plantAlarms.length === 0 && <p className="muted">Nenhum alarme recente.</p>}
            <ul className="list">
              {plantAlarms.map((alarm) => (
                <li key={alarm.id}>
                  <div>
                    <strong>{alarm.code}</strong>
                    <span className="micro">{alarm.description}</span>
                  </div>
                  <span className="pill danger">{alarm.severity}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="card">
            <div className="tag">Resumo</div>
            <h3>Dispositivos</h3>
            <ul className="list">
              {plantDevices.map((device) => (
                <li key={device.id} className={device.alarm_active ? 'warning' : ''}>
                  <div>
                    <strong>{device.name}</strong>
                    <span className="micro">ID {device.modbus_id} • {device.family_code || 'N/D'}</span>
                  </div>
                  <span className={`pill ${device.alarm_active ? 'danger' : 'ok'}`}>
                    {device.alarm_active ? 'Alarme' : 'OK'}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card telemetry-card">
          <div className="telemetry-header">
            <div>
              <p className="eyebrow">Telemetria</p>
              <h3>Monitor de povoamento</h3>
              <span className="micro muted">
                Janela {telemetryWindowMinutes} min
                {overviewAgeLabel ? ` • atualizado há ${overviewAgeLabel}` : ''}
              </span>
            </div>
            <span className={`badge ${telemetryOverview?.db_ready ? 'online' : 'offline'}`}>
              {telemetryOverview?.db_ready ? 'DB online' : 'DB offline'}
            </span>
          </div>
          {telemetryOverviewRows.length === 0 ? (
            <div className="empty-state">
              <p className="muted">Sem dados de telemetria para esta planta.</p>
            </div>
          ) : (
            <div className="telemetry-table" role="table" aria-label="Povoamento de telemetria">
              <div className="telemetry-row telemetry-header" role="row">
                <span>Device</span>
                <span>Status</span>
                <span>Última leitura</span>
                <span>Últ. {telemetryWindowMinutes}m</span>
                <span>Total</span>
              </div>
              {telemetryOverviewRows.map((row) => {
                const device = deviceById[row.device_id];
                const status = device
                  ? resolveDeviceStatus(device)
                  : row.last_telemetry_at
                    ? Date.now() - new Date(row.last_telemetry_at).getTime() < 15000
                      ? 'ok'
                      : 'offline'
                    : 'offline';
                const lastLabel = formatRelativeAge(row.last_telemetry_at);
                const lastTitle = row.last_telemetry_at ? formatTimestamp(row.last_telemetry_at) : 'Sem leitura';
                return (
                  <div key={row.device_id} className="telemetry-row" role="row">
                    <span>{row.device_name || device?.name || `Device ${row.device_id}`}</span>
                    <span className={`pill ${status === 'ok' ? 'online' : status === 'alarm' ? 'alert' : 'offline'}`}>
                      {status === 'ok' ? 'Operando' : status === 'alarm' ? 'Alarme' : 'Offline'}
                    </span>
                    <span title={lastTitle}>{lastLabel ? `há ${lastLabel}` : 'Sem leitura'}</span>
                    <span className="telemetry-count">{row.telemetry_window ?? 0}</span>
                    <span className="telemetry-count">{row.telemetry_total ?? 0}</span>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>

      {isDiagnosticsOpen && (
        <div ref={diagnosticPanelRef} className="diagnostic-panel" role="dialog" aria-live="polite">
          <div className="diagnostic-header">
            <div>
              <p className="eyebrow">Diagnostico</p>
              <h3>Tempo real</h3>
              <span className="micro muted">
                {diagnosticsSnapshot?.updatedAt
                  ? `Atualizado em ${formatTimestamp(diagnosticsSnapshot.updatedAt)}`
                  : 'Aguardando amostras...'}
              </span>
            </div>
            <button type="button" className="ghost compact" onClick={() => setIsDiagnosticsOpen(false)}>
              Fechar
            </button>
          </div>
          <div className="diagnostic-grid">
            <div className="diagnostic-section">
              <h4>Metas</h4>
              <div className="diagnostic-list">
                <div className="diagnostic-row">
                  <span>Refresh realtime</span>
                  <strong>&le; 200 ms</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Timeout leitura realtime</span>
                  <strong>1200 ms</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Polling</span>
                  <strong>{Math.round(telemetryPollMs / 1000)} s</strong>
                </div>
              </div>
            </div>
            <div className="diagnostic-section">
              <h4>Velocidades medidas</h4>
              <div className="diagnostic-list">
                <div className="diagnostic-row">
                  <span>Refresh realtime (último)</span>
                  <strong>{formatMs(diagnosticsSnapshot?.refreshStats?.last)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Refresh realtime (média)</span>
                  <strong>{formatMs(diagnosticsSnapshot?.refreshStats?.avg)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Leitura realtime (último)</span>
                  <strong>{formatMs(diagnosticsSnapshot?.telemetryStats?.last)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Overview (último)</span>
                  <strong>{formatMs(diagnosticsSnapshot?.overviewStats?.last)}</strong>
                </div>
              </div>
            </div>
            <div className="diagnostic-section">
              <h4>Rede</h4>
              <div className="diagnostic-list">
                <div className="diagnostic-row">
                  <span>Download (último)</span>
                  <strong>{formatBitrate(diagnosticsSnapshot?.networkStats?.down?.last)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Download (média)</span>
                  <strong>{formatBitrate(diagnosticsSnapshot?.networkStats?.down?.avg)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Upload (último)</span>
                  <strong>{formatBitrate(diagnosticsSnapshot?.networkStats?.up?.last)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>Consumo da sessão</span>
                  <strong>
                    {`${formatBytes(diagnosticsSnapshot?.networkStats?.totalDownBytes)} ↓ / ${formatBytes(diagnosticsSnapshot?.networkStats?.totalUpBytes)} ↑`}
                  </strong>
                </div>
              </div>
            </div>
            <div className="diagnostic-section">
              <h4>Servidor</h4>
              <div className="diagnostic-list">
                <div className="diagnostic-row">
                  <span>{activePlant?.hostname || 'Servidor atual'}</span>
                  <strong>{formatMs(diagnosticsSnapshot?.serverStats?.avg)}</strong>
                </div>
                <div className="diagnostic-row">
                  <span>p95</span>
                  <strong>{formatMs(diagnosticsSnapshot?.serverStats?.p95)}</strong>
                </div>
              </div>
            </div>
            <div className="diagnostic-section">
              <h4>Devices</h4>
              <div className="diagnostic-table">
                {diagnosticDeviceRows.length === 0 && (
                  <span className="mini-alarms-empty">Sem amostras</span>
                )}
                {diagnosticDeviceRows.slice(0, 8).map((row) => (
                  <div key={row.id} className="diagnostic-row">
                    <span className="diagnostic-row-title">{row.name}</span>
                    <strong>{formatMs(row.avg)}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="diagnostic-section">
              <h4>Variaveis</h4>
              <div className="diagnostic-table">
                {diagnosticVariableRows.length === 0 && (
                  <span className="mini-alarms-empty">Sem amostras</span>
                )}
                {diagnosticVariableRows.slice(0, 10).map((row) => (
                  <div key={row.key} className="diagnostic-row">
                    <span className="diagnostic-row-text">
                      <span className="diagnostic-row-title">{row.label}</span>
                      <span className="micro muted">{row.deviceName} • {getDisplayCode(row.code)}</span>
                    </span>
                    <strong>{formatMs(row.avg)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRealtimeOverlay && (
        <div className="telemetry-loading-overlay" role="status" aria-live="polite">
          <div className="telemetry-loading-card telemetry-loading-float">
            <div className="telemetry-loading-bar"><span /></div>
            <strong>Carregando</strong>
            <span className="micro muted">Sincronizando leituras em tempo real...</span>
          </div>
        </div>
      )}

      {isVariableModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeVariableModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Variaveis do device</p>
                <h3>Selecione ate 5 variaveis</h3>
              </div>
              <button type="button" className="ghost" onClick={closeVariableModal}>
                Fechar
              </button>
            </div>
            {canEditDeviceName && (
              <div className="device-name-edit">
                <label>
                  Nome do device
                  <input
                    value={deviceNameDraft}
                    onChange={(event) => setDeviceNameDraft(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="ghost compact"
                  onClick={handleSaveDeviceName}
                  disabled={saveDeviceNamePending}
                >
                  {saveDeviceNamePending ? 'Salvando...' : 'Atualizar nome'}
                </button>
              </div>
            )}
            {selectedDeviceId && (
              <div className="mini-graph-toggle">
                <span className="micro muted">Mini grafico na miniatura</span>
                <button
                  type="button"
                  className={`ghost compact ${isMiniGraphEnabled(selectedDeviceId) ? 'active' : ''}`}
                  onClick={() => toggleMiniGraphForDevice(selectedDeviceId)}
                >
                  {isMiniGraphEnabled(selectedDeviceId) ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            )}
            {selectedDeviceId && (
              <div className="mini-graph-toggle">
                <span className="micro muted">Mini box de alarmes</span>
                <button
                  type="button"
                  className={`ghost compact ${isMiniAlarmEnabled(selectedDeviceId) ? 'active' : ''}`}
                  onClick={() => toggleMiniAlarmsForDevice(selectedDeviceId)}
                >
                  {isMiniAlarmEnabled(selectedDeviceId) ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            )}
            {selectedDeviceId && (
              <div className="mini-graph-toggle">
                <span className="micro muted">Variaveis do mini grafico (max 3)</span>
                <div className="toolbar-actions">
                  <span className="micro muted">{selectedMiniGraphVariableIds.length}/3</span>
                  <button
                    type="button"
                    className="ghost compact"
                    onClick={() => {
                      if (!selectedDeviceId) return;
                      const normalizedMini = upsertMiniGraphSelectionForDevice(selectedDeviceId, selectedMiniGraphVariableIds);
                      void persistMiniGraphSelectionForDevice(selectedDeviceId, normalizedMini);
                      closeVariableModal();
                      setGraphViewMode('mini');
                      setGraphDeviceId(selectedDeviceId);
                    }}
                  >
                    Ver mini grafico
                  </button>
                  <button
                    type="button"
                    className={`ghost compact ${isMiniGraphVariablePickerOpen ? 'active' : ''}`}
                    onClick={() => setIsMiniGraphVariablePickerOpen((prev) => !prev)}
                  >
                    {isMiniGraphVariablePickerOpen ? 'Ocultar' : 'Selecionar'}
                  </button>
                </div>
              </div>
            )}
            {selectedDeviceId && isMiniGraphVariablePickerOpen && (
              <div className="variable-picker mini-graph-picker">
                {deviceVariables.map((variable) => {
                  const checked = selectedMiniGraphVariableIds.includes(variable.id);
                  const disabled = !checked && selectedMiniGraphVariableIds.length >= 3;
                  return (
                    <label key={`mini-${variable.id}`} className={`variable-option ${checked ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleMiniGraphVariableSelection(variable.id)}
                      />
                      <span>
                        <strong>{getDisplayLabel(variable.label, variable.code)}</strong>
                        <span className="micro muted">{getDisplayCode(variable.code)}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
            <div className="variable-picker">
              {deviceVariables.map((variable) => {
                const checked = selectedVariableIds.includes(variable.id);
                const disabled = !checked && selectedVariableIds.length >= 5;
                return (
                  <label key={variable.id} className={`variable-option ${checked ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleVariableSelection(variable.id)}
                    />
                    <span>
                      <strong>{getDisplayLabel(variable.label, variable.code)}</strong>
                      <span className="micro muted">{getDisplayCode(variable.code)}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {selectedDeviceId && getReadWriteVariablesForDevice(selectedDeviceId).length > 0 && (
              <div className="rw-section">
                <div className="rw-header">
                  <h4>Leitura/Escrita Lista de variaveis</h4>
                </div>
                <div className="rw-table" role="table" aria-label="Leitura/Escrita Lista de variaveis">
                  <div className="rw-row rw-header" role="row">
                    <span>Valentia</span>
                    <span>Novo valor</span>
                    <span>Codigo</span>
                    <span>Descricao</span>
                  </div>
                  {getReadWriteVariablesForDevice(selectedDeviceId).map((variable) => {
                    const reading = getReading(selectedDeviceId, variable.code);
                    const value = reading?.value ?? '--';
                    const unit = resolveUnit(variable.code, variable.unit || reading?.unit);
                    const status = rwStatus[variable.code];
                    const isPending = status?.status === 'pending';
                    const hasValue = String(rwInputs[variable.code] || '').trim().length > 0;
                    return (
                      <div key={variable.code} className="rw-row" role="row">
                        <span className="rw-value">
                          <strong>{value}</strong>
                          {unit ? <span className="micro muted">{unit}</span> : null}
                        </span>
                        <div className="rw-input">
                          <div className="rw-input-field">
                            <input
                              type="text"
                              value={rwInputs[variable.code] || ''}
                              onChange={(event) => handleRwInputChange(variable.code, event.target.value)}
                              placeholder="Novo valor"
                              disabled={isPending}
                            />
                            <button
                              type="button"
                              className="ghost rw-action"
                              onClick={() => handleWriteVariable(variable.code)}
                              disabled={isPending || !hasValue}
                            >
                              {isPending ? 'Enviando...' : 'Aplicar'}
                            </button>
                          </div>
                          {status?.message ? (
                            <span className={`rw-status ${status.status}`}>{status.message}</span>
                          ) : null}
                        </div>
                        <span>{getDisplayCode(variable.code)}</span>
                        <span className="rw-description">{variable.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="toolbar">
              <span className="micro muted">{selectedVariableIds.length}/5 selecionadas • mini: {selectedMiniGraphVariableIds.length}/3</span>
              <div className="toolbar-actions">
                <button type="button" className="ghost" onClick={closeVariableModal}>
                  Cancelar
                </button>
                <button type="button" className="primary" onClick={handleSaveDashboardVariables} disabled={saveVariablesPending}>
                  {saveVariablesPending ? 'Salvando...' : 'Salvar selecao'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {detailDeviceId && (
        <DeviceDetailModal
          device={plantDevices.find((item) => item.id === detailDeviceId)}
          asset={deviceAssets[detailDeviceId]}
          readings={telemetryByDevice[detailDeviceId] || []}
          variables={detailVariables}
          rawReadings={detailReadings}
          rawReadingsPending={detailReadingsPending}
          formatReadingValue={formatReadingValue}
          statusResolver={resolveDeviceStatus}
          onClose={() => setDetailDeviceId(null)}
          onEditVariables={() => {
            setDetailDeviceId(null);
            openVariableModal(detailDeviceId);
          }}
          onOpenGraph={() => {
            setDetailDeviceId(null);
            setGraphViewMode('main');
            setGraphDeviceId(detailDeviceId);
          }}
          canEditName={canEditDeviceName}
          onSaveName={async (nextName) => {
            if (!detailDeviceId) return;
            const normalizedName = String(nextName || '').trim();
            if (!normalizedName) return;
            const response = await fetchJson(`/api/devices/${detailDeviceId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: normalizedName }),
            });
            if (response?.status === 'ok') {
              setDeviceNameOverrides((prev) => ({ ...prev, [detailDeviceId]: normalizedName }));
              setDeviceNameDraft(normalizedName);
              void refresh({ background: true });
            }
          }}
        />
      )}

      {graphDeviceId && (
        <DeviceGraphModal
          device={plantDevices.find((item) => item.id === graphDeviceId)}
          defaultVariables={graphDefaultVariables}
          allVariables={graphAllVariables}
          fallbackCodes={graphFallbackCodes}
          liveReadings={telemetryByDevice[graphDeviceId] || []}
          miniGraphSelectedIds={graphDeviceId ? (miniGraphVariableIdsByDevice[graphDeviceId] || []) : []}
          initialViewMode={graphViewMode}
          onMiniGraphSelectionChange={(nextIds) => {
            if (!graphDeviceId) return;
            const normalizedMini = upsertMiniGraphSelectionForDevice(graphDeviceId, nextIds);
            void persistMiniGraphSelectionForDevice(graphDeviceId, normalizedMini);
          }}
          onClose={() => setGraphDeviceId(null)}
        />
      )}
    </main>
  );
}

function DeviceGraphModal({
  device,
  defaultVariables,
  allVariables: preloadedVariables,
  fallbackCodes,
  liveReadings,
  miniGraphSelectedIds = [],
  initialViewMode = 'main',
  onMiniGraphSelectionChange,
  onClose,
}) {
  const deviceId = device?.id;
  const graphSelectionStorageKey = 'graphVariableCodesByDevice';
  const [allVariables, setAllVariables] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [miniGraphIds, setMiniGraphIds] = useState([]);
  const [isMiniPickerOpen, setIsMiniPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState(initialViewMode === 'mini' ? 'mini' : 'main');
  const [graphData, setGraphData] = useState({});
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectionRange, setSelectionRange] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [zoomRange, setZoomRange] = useState(null);
  const [hoverState, setHoverState] = useState(null);
  const canvasRef = useRef(null);
  const hoverFrameRef = useRef(null);
  const hoverPointerRef = useRef(null);
  const graphGeometryRef = useRef(null);
  const stableGraphRef = useRef({});
  const liveRangeRef = useRef(null);
  const yRangeRef = useRef(null);
  const previousMiniSyncDeviceRef = useRef(null);

  const colorPalette = ['#22c55e', '#38bdf8', '#f59e0b', '#f472b6', '#a78bfa'];
  const maxPointsPerSeries = 10000;
  const telemetryFetchLimit = 10000;
  const startupSpanMs = 180000;
  const historyFillRatio = chartHistoryFillRatio;
  const minRealtimeSpanMs = 5000;

  const resolveInitialSelectionIds = useCallback((variables) => {
    if (!Array.isArray(variables) || variables.length === 0) {
      return [];
    }
    const idsByCode = new Map(
      variables.map((variable) => [resolveCode(variable.code), Number(variable.id)])
    );
    if (Array.isArray(defaultVariables) && defaultVariables.length) {
      const ids = defaultVariables
        .map((item) => Number(item?.variable_id || idsByCode.get(resolveCode(item?.code))))
        .filter((id) => Number.isFinite(id));
      if (ids.length) {
        return Array.from(new Set(ids)).slice(0, 5);
      }
    }
    const fallbackSet = fallbackCodes?.length ? new Set(fallbackCodes.map(resolveCode)) : new Set();
    const fallbackIds = variables
      .filter((variable) => fallbackSet.has(resolveCode(variable.code)))
      .map((variable) => Number(variable.id))
      .filter((id) => Number.isFinite(id));
    if (fallbackIds.length) {
      return fallbackIds.slice(0, 5);
    }
    return variables.slice(0, 5).map((variable) => Number(variable.id)).filter((id) => Number.isFinite(id));
  }, [defaultVariables, fallbackCodes]);

  const readSavedGraphCodes = useCallback((targetDeviceId) => {
    if (!targetDeviceId || typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(graphSelectionStorageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const saved = parsed?.[targetDeviceId];
      return Array.isArray(saved) ? saved : [];
    } catch (err) {
      return [];
    }
  }, []);

  const isSameSeries = useCallback((seriesA, seriesB) => isSameTimeSeries(seriesA, seriesB), []);

  const mergeSeries = useCallback((baseSeries, incomingSeries) => {
    const merged = mergeTimeSeries(baseSeries, incomingSeries, maxPointsPerSeries);
    return trimSeriesToTimeWindow(merged, chartMaxHistoryMs);
  }, [maxPointsPerSeries]);

  const interpolateSeriesValue = useCallback((series, targetTimestamp) => (
    interpolateSeriesValueAt(series, targetTimestamp)
  ), []);

  const formatGraphReading = useCallback((value, unit = '') => formatChartReading(value, unit), []);

  const getMetricUnit = useCallback((metric) => resolveUnit(metric?.code, metric?.measure_unit || metric?.unit), []);
  const normalizeMiniGraphIds = useCallback((ids) => (
    (Array.isArray(ids) ? ids : [])
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .slice(0, 3)
  ), []);
  const isSameIdList = useCallback((left, right) => {
    const sourceLeft = Array.isArray(left) ? left : [];
    const sourceRight = Array.isArray(right) ? right : [];
    if (sourceLeft.length !== sourceRight.length) return false;
    for (let index = 0; index < sourceLeft.length; index += 1) {
      if (sourceLeft[index] !== sourceRight[index]) return false;
    }
    return true;
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setGraphData({});
    setSelectionRange(null);
    setZoomRange(null);
    setHoverState(null);
    stableGraphRef.current = {};
    const loadVariables = async () => {
      const preload = Array.isArray(preloadedVariables) ? preloadedVariables : [];
      if (preload.length) {
        setAllVariables(preload);
        const savedCodes = readSavedGraphCodes(deviceId).map((code) => resolveCode(code));
        const preloadIdsByCode = new Map(
          preload.map((variable) => [resolveCode(variable.code), Number(variable.id)])
        );
        const savedIds = savedCodes
          .map((code) => preloadIdsByCode.get(code))
          .filter((id) => Number.isFinite(id));
        setSelectedIds(savedIds.length ? Array.from(new Set(savedIds)).slice(0, 5) : resolveInitialSelectionIds(preload));
      }
      const response = await fetchJson(`/api/devices/${deviceId}/variables`, {}, { timeoutMs: 900 });
      if (!active) return;
      const variables = response?.data || preload;
      setAllVariables(variables);
      const savedCodes = readSavedGraphCodes(deviceId).map((code) => resolveCode(code));
      const idsByCode = new Map(
        variables.map((variable) => [resolveCode(variable.code), Number(variable.id)])
      );
      const savedIds = savedCodes
        .map((code) => idsByCode.get(code))
        .filter((id) => Number.isFinite(id));
      setSelectedIds(savedIds.length ? Array.from(new Set(savedIds)).slice(0, 5) : resolveInitialSelectionIds(variables));
    };
    loadVariables();
    return () => {
      active = false;
    };
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId || !allVariables.length || typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(() => {
      const selectedSet = new Set(selectedIds);
      const selectedCodes = allVariables
        .filter((variable) => selectedSet.has(variable.id))
        .map((variable) => variable.code)
        .slice(0, 5);
      try {
        const raw = window.localStorage.getItem(graphSelectionStorageKey);
        const parsed = raw ? JSON.parse(raw) : {};
        const next = (parsed && typeof parsed === 'object') ? { ...parsed } : {};
        if (!selectedCodes.length) {
          delete next[deviceId];
        } else {
          next[deviceId] = selectedCodes;
        }
        window.localStorage.setItem(graphSelectionStorageKey, JSON.stringify(next));
      } catch (err) {
        // ignore storage errors
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [deviceId, selectedIds, allVariables]);

  useEffect(() => {
    const sanitized = normalizeMiniGraphIds(miniGraphSelectedIds);
    setMiniGraphIds((prev) => (isSameIdList(prev, sanitized) ? prev : sanitized));
    if (previousMiniSyncDeviceRef.current !== deviceId) {
      previousMiniSyncDeviceRef.current = deviceId;
      setIsMiniPickerOpen(false);
    }
  }, [deviceId, miniGraphSelectedIds, normalizeMiniGraphIds, isSameIdList]);

  useEffect(() => {
    setViewMode(initialViewMode === 'mini' ? 'mini' : 'main');
  }, [deviceId, initialViewMode]);

  const activeSelectionIds = useMemo(() => {
    const source = viewMode === 'mini' ? miniGraphIds : selectedIds;
    const limit = viewMode === 'mini' ? 3 : 5;
    return source
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .slice(0, limit);
  }, [viewMode, miniGraphIds, selectedIds]);

  useEffect(() => {
    if (!deviceId || !activeSelectionIds.length) {
      setGraphData({});
      return;
    }
    const selectedVariables = allVariables.filter((variable) => activeSelectionIds.includes(variable.id));
    if (!selectedVariables.length) {
      setGraphData({});
      return;
    }
    const metrics = selectedVariables.map((variable) => variable.code).join(',');
    const start = new Date(Date.now() - chartMaxHistoryMs).toISOString();
    const fetchTelemetry = async () => {
      const response = await fetchJson(
        `/api/devices/${deviceId}/telemetry?metrics=${encodeURIComponent(metrics)}&start=${encodeURIComponent(start)}&limit=${telemetryFetchLimit}`,
        {},
        { timeoutMs: 1400 },
      );
      const rows = response?.data || [];
      const grouped = {};
      for (const row of rows) {
        const value = Number(row?.value);
        const capturedAt = new Date(row?.captured_at).getTime();
        if (!Number.isFinite(value) || !Number.isFinite(capturedAt) || !row?.metric) continue;
        if (!grouped[row.metric]) grouped[row.metric] = [];
        grouped[row.metric].push({
          t: capturedAt,
          value,
        });
      }
      setGraphData((prev) => {
        const next = { ...prev };
        let changed = false;
        selectedVariables.forEach((variable) => {
          const code = variable.code;
          if (!grouped[code] || grouped[code].length === 0) return;
          const currentSeries = next[code] || [];
          const mergedSeries = mergeSeries(currentSeries, grouped[code]);
          if (isSameSeries(currentSeries, mergedSeries)) return;
          next[code] = mergedSeries;
          changed = true;
        });
        return changed ? next : prev;
      });
    };
    fetchTelemetry();
  }, [deviceId, activeSelectionIds, allVariables, mergeSeries, isSameSeries]);

  useEffect(() => {
    if (!deviceId || !activeSelectionIds.length || !Array.isArray(liveReadings) || liveReadings.length === 0) return;
    const selectedVariables = allVariables.filter((variable) => activeSelectionIds.includes(variable.id));
    if (!selectedVariables.length) return;
    const selectedMap = new Map(
      selectedVariables.map((variable) => [resolveCode(variable.code), variable.code])
    );
    const updatesByCode = {};
    liveReadings.forEach((reading) => {
      const normalized = resolveCode(reading.code);
      const code = selectedMap.get(normalized);
      if (!code) return;
      const capturedAt = reading.captured_at ? new Date(reading.captured_at).getTime() : Date.now();
      const value = Number(reading?.value);
      if (!Number.isFinite(capturedAt) || !Number.isFinite(value)) return;
      if (!updatesByCode[code]) updatesByCode[code] = [];
      updatesByCode[code].push({ t: capturedAt, value });
    });
    const updateCodes = Object.keys(updatesByCode);
    if (!updateCodes.length) return;
    setGraphData((prev) => {
      const next = { ...prev };
      let changed = false;
      updateCodes.forEach((code) => {
        const currentSeries = next[code] || [];
        const mergedSeries = mergeSeries(currentSeries, updatesByCode[code]);
        if (isSameSeries(currentSeries, mergedSeries)) return;
        next[code] = mergedSeries;
        changed = true;
      });
      return changed ? next : prev;
    });
  }, [deviceId, activeSelectionIds, allVariables, liveReadings, mergeSeries, isSameSeries]);

  const resolvedMetrics = useMemo(() => {
    const selectedVariables = allVariables.filter((variable) => activeSelectionIds.includes(variable.id));
    return selectedVariables.length ? selectedVariables : [];
  }, [allVariables, activeSelectionIds]);

  useEffect(() => {
    liveRangeRef.current = null;
    yRangeRef.current = null;
  }, [deviceId, viewMode]);

  const effectiveGraphData = useMemo(() => {
    const stable = { ...stableGraphRef.current };
    const next = {};
    resolvedMetrics.forEach((metric) => {
      const currentSeries = Array.isArray(graphData[metric.code]) ? graphData[metric.code] : [];
      if (currentSeries.length) {
        next[metric.code] = currentSeries;
        stable[metric.code] = currentSeries;
      } else if (Array.isArray(stable[metric.code]) && stable[metric.code].length) {
        next[metric.code] = stable[metric.code];
      } else {
        next[metric.code] = [];
      }
    });
    stableGraphRef.current = stable;
    return next;
  }, [graphData, resolvedMetrics]);

  const graphRange = useMemo(() => {
    const allPoints = resolvedMetrics.flatMap((metric) => effectiveGraphData[metric.code] || []);
    if (!allPoints.length) {
      liveRangeRef.current = null;
      return null;
    }
    const times = allPoints.map((point) => point.t);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const nextRange = buildSharedTimeRange({
      minTime,
      maxTime,
      previousRange: liveRangeRef.current,
      zoomRange,
      historyFillRatio,
      minRealtimeSpanMs,
      startupSpanMs,
    });
    if (!nextRange) {
      liveRangeRef.current = null;
      return null;
    }
    if (!zoomRange) {
      liveRangeRef.current = { start: nextRange.start, end: nextRange.end };
    }
    return nextRange;
  }, [effectiveGraphData, resolvedMetrics, zoomRange, historyFillRatio, minRealtimeSpanMs, startupSpanMs]);

  const latestLiveRange = useMemo(() => {
    const allPoints = resolvedMetrics.flatMap((metric) => effectiveGraphData[metric.code] || []);
    if (!allPoints.length) return null;
    const times = allPoints.map((point) => point.t);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    return buildSharedTimeRange({
      minTime,
      maxTime,
      historyFillRatio,
      minRealtimeSpanMs,
      startupSpanMs,
    });
  }, [effectiveGraphData, resolvedMetrics, historyFillRatio, minRealtimeSpanMs, startupSpanMs]);

  useEffect(() => {
    yRangeRef.current = null;
  }, [zoomRange, deviceId, viewMode]);

  const buildHoverState = useCallback((pointerX) => {
    if (!graphRange || !resolvedMetrics.length) {
      setHoverState(null);
      return;
    }
    const geometry = graphGeometryRef.current;
    if (!geometry) {
      setHoverState(null);
      return;
    }
    const {
      padding,
      width,
      height,
      start,
      end,
      minValue,
      valueRange,
    } = geometry;
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      setHoverState(null);
      return;
    }
    const clampedX = Math.max(padding, Math.min(padding + width, pointerX));
    const ratio = (clampedX - padding) / width;
    const timestamp = start + (end - start) * ratio;
    const points = resolvedMetrics.map((metric, index) => {
      const series = (effectiveGraphData[metric.code] || [])
        .filter((point) => point.t >= start && point.t <= end);
      const interpolated = interpolateSeriesValue(series, timestamp);
      if (!Number.isFinite(interpolated)) return null;
      const y = padding + height - ((interpolated - minValue) / valueRange) * height;
      return {
        code: metric.code,
        label: getDisplayLabel(metric.label, metric.code),
        unit: getMetricUnit(metric),
        value: interpolated,
        y,
        color: colorPalette[index % colorPalette.length],
      };
    }).filter(Boolean);
    if (!points.length) {
      setHoverState(null);
      return;
    }
    setHoverState({ x: clampedX, timestamp, points });
  }, [colorPalette, effectiveGraphData, getMetricUnit, graphRange, interpolateSeriesValue, resolvedMetrics]);

  useEffect(() => () => {
    if (hoverFrameRef.current && typeof window !== 'undefined' && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(hoverFrameRef.current);
      hoverFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const ratio = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const { clientWidth, clientHeight } = canvas;
    const targetWidth = Math.floor(clientWidth * ratio);
    const targetHeight = Math.floor(clientHeight * ratio);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, clientWidth, clientHeight);
    graphGeometryRef.current = null;

    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.fillRect(0, 0, clientWidth, clientHeight);

    if (!graphRange || !resolvedMetrics.length) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '14px "Inter", system-ui, sans-serif';
      ctx.fillText('Sem dados para o periodo selecionado.', 16, clientHeight / 2);
      return;
    }

    const padding = 24;
    const width = clientWidth - padding * 2;
    const height = clientHeight - padding * 2;
    const start = graphRange.start;
    const end = graphRange.end;
    if (end <= start) {
      return;
    }

    const allValues = resolvedMetrics.flatMap((metric) => (effectiveGraphData[metric.code] || [])
      .filter((point) => point.t >= start && point.t <= end)
      .map((point) => point.value));
    if (!allValues.length) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '14px "Inter", system-ui, sans-serif';
      ctx.fillText('Aguardando leituras em tempo real...', 16, clientHeight / 2);
      return;
    }
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const rawSpan = rawMax - rawMin;
    const baseSpan = rawSpan || Math.max(Math.abs(rawMax) * 0.05, 1);
    const margin = baseSpan * 0.08;
    const expandedMin = rawMin - margin;
    const expandedMax = rawMax + margin;
    let minValue = expandedMin;
    let maxValue = expandedMax;
    if (!zoomRange) {
      const previousYRange = yRangeRef.current;
      if (previousYRange && Number.isFinite(previousYRange.min) && Number.isFinite(previousYRange.max)) {
        const damping = 0.16;
        minValue = expandedMin < previousYRange.min
          ? expandedMin
          : previousYRange.min + (expandedMin - previousYRange.min) * damping;
        maxValue = expandedMax > previousYRange.max
          ? expandedMax
          : previousYRange.max + (expandedMax - previousYRange.max) * damping;
      }
      yRangeRef.current = { min: minValue, max: maxValue };
    } else {
      yRangeRef.current = { min: expandedMin, max: expandedMax };
    }
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || maxValue - minValue < 1e-6) {
      minValue = rawMin - 0.5;
      maxValue = rawMax + 0.5;
    }
    const valueRange = maxValue - minValue || 1;
    graphGeometryRef.current = { padding, width, height, start, end, minValue, maxValue, valueRange };

    const tickCount = 4;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 1;
    ctx.font = '11px "Inter", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    for (let i = 0; i <= tickCount; i += 1) {
      const y = padding + (height / tickCount) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
      const value = maxValue - (valueRange / tickCount) * i;
      ctx.fillText(value.toFixed(1), 6, y + 4);
    }

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(padding, padding, width, height);
    ctx.stroke();

    resolvedMetrics.forEach((metric, index) => {
      const points = (effectiveGraphData[metric.code] || [])
        .filter((point) => point.t >= start && point.t <= end);
      if (!points.length) return;
      const projected = points
        .map((point) => ({
          x: padding + ((point.t - start) / (end - start)) * width,
          y: padding + height - ((point.value - minValue) / valueRange) * height,
        }))
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
      if (!projected.length) return;
      ctx.strokeStyle = colorPalette[index % colorPalette.length];
      ctx.lineWidth = 2;
      if (projected.length === 1) {
        const only = projected[0];
        ctx.beginPath();
        ctx.fillStyle = colorPalette[index % colorPalette.length];
        ctx.arc(only.x, only.y, 3, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.beginPath();
      projected.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    if (hoverState && !dragState && hoverState.points?.length) {
      const crossX = Math.max(padding, Math.min(padding + width, hoverState.x));
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(crossX, padding);
      ctx.lineTo(crossX, padding + height);
      ctx.stroke();
      ctx.restore();

      hoverState.points.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = point.color;
        ctx.arc(crossX, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    if (dragState && dragState.currentX !== null) {
      const startX = Math.min(dragState.startX, dragState.currentX);
      const endX = Math.max(dragState.startX, dragState.currentX);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.fillRect(startX, padding, endX - startX, height);
    }

    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '11px "Inter", system-ui, sans-serif';
    ctx.fillText(new Date(start).toLocaleTimeString(), padding, clientHeight - 6);
    const endLabel = new Date(end).toLocaleTimeString();
    const endLabelWidth = ctx.measureText(endLabel).width;
    ctx.fillText(endLabel, padding + width - endLabelWidth, clientHeight - 6);
  }, [effectiveGraphData, resolvedMetrics, graphRange, dragState, hoverState, zoomRange]);

  const handleMouseDown = (event) => {
    if (!graphRange) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const startX = event.clientX - bounds.left;
    setDragState({ startX, currentX: startX, bounds });
  };

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    hoverPointerRef.current = pointerX;
    if (dragState) {
      const currentX = event.clientX - dragState.bounds.left;
      setDragState((prev) => ({ ...prev, currentX }));
    }
    if (hoverFrameRef.current) {
      return;
    }
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      hoverFrameRef.current = window.requestAnimationFrame(() => {
        hoverFrameRef.current = null;
        const nextPointerX = Number.isFinite(hoverPointerRef.current) ? hoverPointerRef.current : pointerX;
        buildHoverState(nextPointerX);
      });
      return;
    }
    buildHoverState(pointerX);
  };

  const handleMouseUp = (event) => {
    if (!dragState || !graphRange) {
      setDragState(null);
      if (event) {
        const bounds = event.currentTarget.getBoundingClientRect();
        buildHoverState(event.clientX - bounds.left);
      }
      return;
    }
    const delta = Math.abs(dragState.currentX - dragState.startX);
    if (delta < 5) {
      setSelectionRange(null);
      setZoomRange(null);
      setDragState(null);
      return;
    }
    const { start, end } = graphRange;
    const width = dragState.bounds.width;
    const startRatio = Math.min(dragState.startX, dragState.currentX) / width;
    const endRatio = Math.max(dragState.startX, dragState.currentX) / width;
    const rangeStart = start + (end - start) * startRatio;
    const rangeEnd = start + (end - start) * endRatio;
    setSelectionRange({ start: rangeStart, end: rangeEnd });
    setZoomRange({ start: rangeStart, end: rangeEnd });
    setDragState(null);
    if (event) {
      const bounds = event.currentTarget.getBoundingClientRect();
      buildHoverState(event.clientX - bounds.left);
    }
  };

  const handleMouseLeave = () => {
    setHoverState(null);
    hoverPointerRef.current = null;
    if (dragState) {
      setDragState(null);
    }
    if (hoverFrameRef.current && typeof window !== 'undefined' && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(hoverFrameRef.current);
      hoverFrameRef.current = null;
    }
  };

  const averages = useMemo(() => {
    if (!selectionRange) return [];
    return resolvedMetrics.map((metric) => {
      const points = (effectiveGraphData[metric.code] || [])
        .filter((point) => point.t >= selectionRange.start && point.t <= selectionRange.end);
      if (!points.length) {
        return { metric, average: null };
      }
      const sum = points.reduce((total, point) => total + point.value, 0);
      return { metric, average: sum / points.length };
    });
  }, [selectionRange, resolvedMetrics, effectiveGraphData]);

  const hoverTooltipStyle = useMemo(() => {
    if (!hoverState) return null;
    const canvasWidth = canvasRef.current?.clientWidth || 0;
    const tooltipWidth = 230;
    const preferredLeft = hoverState.x + 12;
    const left = canvasWidth
      ? Math.max(8, Math.min(canvasWidth - tooltipWidth - 8, preferredLeft))
      : preferredLeft;
    return { left: `${left}px` };
  }, [hoverState]);

  const toggleGraphVariable = (variableId) => {
    setSelectedIds((prev) => {
      if (prev.includes(variableId)) {
        return prev.filter((item) => item !== variableId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, variableId];
    });
  };

  const toggleMiniGraphVariable = (variableId) => {
    setMiniGraphIds((prev) => {
      let next;
      if (prev.includes(variableId)) {
        next = prev.filter((item) => item !== variableId);
      } else if (prev.length >= 3) {
        next = prev;
      } else {
        next = [...prev, variableId];
      }
      const normalized = normalizeMiniGraphIds(next);
      onMiniGraphSelectionChange?.(normalized);
      return normalized;
    });
    setViewMode('mini');
  };

  const panGraphWindow = useCallback((direction, fraction = 0.18) => {
    if (!graphRange || !latestLiveRange) return;
    const span = graphRange.end - graphRange.start;
    if (!Number.isFinite(span) || span <= 1) return;
    const delta = span * fraction * direction;
    let start = graphRange.start + delta;
    let end = graphRange.end + delta;
    const minBound = latestLiveRange.start;
    const maxBound = latestLiveRange.end;
    if (start < minBound) {
      const shift = minBound - start;
      start += shift;
      end += shift;
    }
    if (end > maxBound) {
      const shift = end - maxBound;
      start -= shift;
      end -= shift;
    }
    if (start < minBound) start = minBound;
    if (end > maxBound) end = maxBound;
    if (end - start <= 1) return;
    setSelectionRange(null);
    setZoomRange({ start, end });
  }, [graphRange, latestLiveRange]);

  const jumpToGraphEdge = useCallback((edge) => {
    if (!graphRange || !latestLiveRange) return;
    if (edge === 'right') {
      setSelectionRange(null);
      setZoomRange(null);
      return;
    }
    const span = graphRange.end - graphRange.start;
    const minBound = latestLiveRange.start;
    const maxBound = latestLiveRange.end;
    let start = minBound;
    let end = Math.min(maxBound, start + span);
    if (end - start < span) {
      start = Math.max(minBound, end - span);
    }
    setSelectionRange(null);
    setZoomRange({ start, end });
  }, [graphRange, latestLiveRange]);

  const selectionLabel = selectionRange
    ? `${new Date(selectionRange.start).toLocaleTimeString()} - ${new Date(selectionRange.end).toLocaleTimeString()}`
    : null;

  if (!device) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal graph-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Grafico de telemetria</p>
            <h3>{device.name}</h3>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="ghost" onClick={() => setIsPickerOpen((prev) => !prev)}>
              Selecionar variaveis
            </button>
            <button type="button" className="ghost" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
        <div className="graph-view-toggle">
          <button
            type="button"
            className={`ghost compact ${viewMode === 'main' ? 'active' : ''}`}
            onClick={() => setViewMode('main')}
          >
            Grafico principal
          </button>
          <button
            type="button"
            className={`ghost compact ${viewMode === 'mini' ? 'active' : ''}`}
            onClick={() => setViewMode('mini')}
          >
            Mini grafico
          </button>
        </div>
        <div className="graph-nav-controls">
          <span className="micro muted">Navegar no tempo</span>
          <div className="toolbar-actions">
            <button
              type="button"
              className="ghost compact"
              onClick={() => panGraphWindow(-1)}
              disabled={!graphRange || !latestLiveRange}
            >
              &lt;
            </button>
            <button
              type="button"
              className="ghost compact"
              onClick={() => jumpToGraphEdge('left')}
              disabled={!graphRange || !latestLiveRange}
            >
              &lt;&lt;
            </button>
            <button
              type="button"
              className="ghost compact"
              onClick={() => panGraphWindow(1)}
              disabled={!graphRange || !latestLiveRange}
            >
              &gt;
            </button>
            <button
              type="button"
              className="ghost compact"
              onClick={() => jumpToGraphEdge('right')}
              disabled={!graphRange || !latestLiveRange}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
        <div
          className="graph-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <canvas ref={canvasRef} />
          {hoverState && !dragState && hoverState.points?.length > 0 && (
            <div className="graph-hover-tooltip" style={hoverTooltipStyle}>
              <div className="graph-hover-time">{new Date(hoverState.timestamp).toLocaleTimeString()}</div>
              {hoverState.points.map((point) => (
                <div key={point.code} className="graph-hover-row">
                  <span className="graph-hover-label">
                    <span className="graph-dot" style={{ background: point.color }} />
                    {point.label}
                  </span>
                  <strong>{formatGraphReading(point.value, point.unit)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
        {isPickerOpen && (
          <div className="graph-picker">
            <span className="micro muted graph-picker-hint">
              {viewMode === 'mini'
                ? `${miniGraphIds.length}/3 selecionadas • modo mini ativo`
                : `${selectedIds.length}/5 selecionadas • salvamento automatico`}
            </span>
            <div className="mini-graph-toggle graph-picker-controls">
              <span className="micro muted">Mini grafico da miniatura (max 3)</span>
              <div className="toolbar-actions">
                <span className="micro muted">{miniGraphIds.length}/3</span>
                <button
                  type="button"
                  className={`ghost compact ${isMiniPickerOpen ? 'active' : ''}`}
                  onClick={() => {
                    setViewMode('mini');
                    setIsMiniPickerOpen((prev) => !prev);
                  }}
                >
                  {isMiniPickerOpen ? 'Ocultar' : 'Selecionar'}
                </button>
              </div>
            </div>
            {isMiniPickerOpen && (
              <div className="variable-picker mini-graph-picker">
                {allVariables.map((variable) => {
                  const checked = miniGraphIds.includes(variable.id);
                  const disabled = !checked && miniGraphIds.length >= 3;
                  return (
                    <label key={`graph-mini-${variable.id}`} className={`variable-option ${checked ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleMiniGraphVariable(variable.id)}
                      />
                      <span>
                        <strong>{getDisplayLabel(variable.label, variable.code)}</strong>
                        <span className="micro muted">{getDisplayCode(variable.code)}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
            {allVariables.map((variable) => {
              const checked = selectedIds.includes(variable.id);
              const disabled = !checked && selectedIds.length >= 5;
              return (
                <label key={variable.id} className={`variable-option ${checked ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleGraphVariable(variable.id)}
                  />
                  <span>
                    <strong>{getDisplayLabel(variable.label, variable.code)}</strong>
                    <span className="micro muted">{getDisplayCode(variable.code)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
        {resolvedMetrics.length > 0 && (
          <div className="graph-legend">
            {resolvedMetrics.map((metric, index) => (
              <div key={metric.code} className="graph-legend-item">
                <span className="graph-dot" style={{ background: colorPalette[index % colorPalette.length] }} />
                <span>{getDisplayLabel(metric.label, metric.code)}</span>
                <span className="micro muted">{getDisplayCode(metric.code)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="graph-footer">
          {selectionLabel ? (
            <div className="graph-averages">
              <span className="micro muted">Media no intervalo: {selectionLabel}</span>
              <div className="graph-average-list">
                {averages.map((entry, index) => (
                  <div key={entry.metric.code} className="graph-average-item">
                    <span className="graph-dot" style={{ background: colorPalette[index % colorPalette.length] }} />
                    <span>{getDisplayLabel(entry.metric.label, entry.metric.code)}</span>
                    <strong>
                      {entry.average !== null
                        ? formatGraphReading(entry.average, getMetricUnit(entry.metric))
                        : '--'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span className="micro muted">Arraste para selecionar um periodo e ver a media.</span>
          )}
          {selectionRange && (
            <button type="button" className="ghost compact" onClick={() => { setSelectionRange(null); setZoomRange(null); }}>
              Limpar selecao
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DeviceDetailModal({
  device,
  asset,
  readings,
  variables,
  rawReadings,
  rawReadingsPending,
  formatReadingValue,
  statusResolver,
  onClose,
  onEditVariables,
  onOpenGraph,
  canEditName,
  onSaveName,
}) {
  const [nameDraft, setNameDraft] = useState(device?.name || '');
  const [saveNamePending, setSaveNamePending] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);

  useEffect(() => {
    setNameDraft(device?.name || '');
    setIsMonitorOpen(false);
  }, [device]);

  if (!device) return null;
  const status = statusResolver(device);
  const readingMap = readings.reduce((acc, reading) => {
    acc[reading.code] = reading;
    return acc;
  }, {});
  const monitorReadings = Array.isArray(rawReadings) ? rawReadings : [];
  const resolveDisplayValue = (code, value) => {
    if (formatReadingValue) return formatReadingValue(device.id, code, value);
    return value ?? '--';
  };
  const normalizedName = String(nameDraft || '').trim();
  const originalName = String(device?.name || '').trim();
  const canSubmitName = Boolean(canEditName && onSaveName && normalizedName && normalizedName !== originalName);
  const handleSubmitName = async () => {
    if (!canSubmitName || saveNamePending) return;
    setSaveNamePending(true);
    try {
      await onSaveName?.(normalizedName);
    } finally {
      setSaveNamePending(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal device-detail-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Detalhes do device</p>
            <h3>{device.name}</h3>
          </div>
          <button type="button" className="ghost" onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="device-detail-body">
          <div className="device-detail-hero">
            <div className={`device-icon-ring device-status-${status}`}>
              <div className="device-icon">
                <img src={asset?.image_path || '/images/pCO.png'} alt={asset?.image_key || 'device'} />
              </div>
            </div>
            <div className="device-detail-info">
              <div className="micro muted">ID {device.modbus_id} • {device.family_code || 'N/D'}</div>
              <span className={`pill ${status === 'ok' ? 'online' : status === 'alarm' ? 'alert' : 'offline'}`}>
                {status === 'ok' ? 'Operando' : status === 'alarm' ? 'Alarme' : 'Offline'}
              </span>
              {canEditName && (
                <div className="device-detail-edit">
                  <label>
                    Titulo da miniatura
                    <input value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} />
                  </label>
                  <button
                    type="button"
                    className="ghost compact"
                    onClick={handleSubmitName}
                    disabled={!canSubmitName || saveNamePending}
                  >
                    {saveNamePending ? 'Salvando...' : 'Atualizar titulo'}
                  </button>
                </div>
              )}
              <div className="device-detail-actions">
                <button type="button" className="ghost" onClick={onEditVariables}>
                  Editar miniatura
                </button>
                <button type="button" className="ghost" onClick={onOpenGraph}>
                  Abrir grafico
                </button>
                <button type="button" className="ghost" onClick={() => setIsMonitorOpen(true)}>
                  Monitor povoamento
                </button>
              </div>
            </div>
          </div>
          <div className="device-detail-variables">
            <div className="device-detail-list">
              {(variables.length ? variables : readings).map((variable) => {
                const code = variable.code || variable.metric;
                const reading = readingMap[code] || variable;
                return (
                  <div key={code} className="device-detail-item">
                    <span>{getDisplayLabel(variable.label, code)}</span>
                    <strong>{resolveDisplayValue(code, reading?.value)} {resolveUnit(code, reading?.unit)}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {isMonitorOpen && (
          <div
            className="modal-overlay device-detail-monitor-overlay"
            role="dialog"
            aria-modal="true"
            onClick={() => setIsMonitorOpen(false)}
          >
            <div className="modal device-detail-monitor-modal" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <p className="eyebrow">Monitor de povoamento</p>
                  <h3>{device.name}</h3>
                </div>
                <button type="button" className="ghost" onClick={() => setIsMonitorOpen(false)}>
                  Fechar
                </button>
              </div>
              <div className="device-detail-monitor">
                <div className="device-detail-header">
                  <strong>Leituras do dispositivo</strong>
                  {rawReadingsPending ? <span className="micro muted">Atualizando...</span> : null}
                </div>
                {monitorReadings.length === 0 ? (
                  <p className="muted">Sem leituras disponiveis.</p>
                ) : (
                  <div className="scan-table" role="table" aria-label="Leituras do dispositivo">
                    <div className="scan-row scan-header" role="row">
                      <span>Codigo</span>
                      <span>Nome</span>
                      <span>Func</span>
                      <span>Endereco</span>
                      <span>Tamanho</span>
                      <span>Valor</span>
                      <span>Status</span>
                    </div>
                    {monitorReadings.map((reading) => (
                      <div key={`${reading.variable_id || reading.code}-${reading.code}`} className="scan-row" role="row">
                        <span>{reading.code}</span>
                        <span>{getDisplayLabel(reading.label, reading.code)}</span>
                        <span>{reading.function_code ?? '--'}</span>
                        <span>{reading.address_in ?? reading.offset ?? '--'}</span>
                        <span>{reading.length ?? '--'}</span>
                        <span>
                          {resolveDisplayValue(reading.code, reading.value)} {resolveUnit(reading.code, reading.unit)}
                        </span>
                        <span>{reading.status || '--'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MultiPlants({ plants, devices, alarms, onSelectPlant }) {
  const navigate = useNavigate();
  const resolvePlantHealth = (plant) => {
    const raw = Number(plant?.health);
    if (Number.isFinite(raw) && raw > 0) {
      return Math.min(100, Math.max(5, raw));
    }
    const status = String(plant?.status || '').toLowerCase();
    if (status === 'online') return 92;
    if (status === 'alert' || status === 'degraded') return 62;
    if (status === 'offline') return 24;
    return 75;
  };

  return (
    <main className="page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Plantas</p>
            <h2>Selecione uma planta</h2>
          </div>
          <div className="badge accent">Saúde consolidada</div>
        </div>
        <div className="grid three-col">
          {plants.map((plant) => (
            <article key={plant.id} className="card">
              <div className="tag">{plant.hostname}</div>
              <h3>{plant.name}</h3>
              <p className="muted">VPN: {plant.vpn_tunnel}</p>
              <ul className="list" style={{ marginBottom: '10px' }}>
                <li>
                  <span>Devices</span>
                  <strong>{(devices?.[plant.id] || []).length}</strong>
                </li>
                <li>
                  <span>Alarmes</span>
                  <strong>{(alarms?.[plant.id] || []).length}</strong>
                </li>
              </ul>
              <div className="health">
                <div className="health-bar" style={{ width: `${resolvePlantHealth(plant)}%` }} />
              </div>
              <div className={`pill ${plant.status}`}>{plant.status}</div>
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  onSelectPlant(plant.id);
                  navigate('/');
                }}
              >
                Ver dashboard
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function SetupPage({ plants, user }) {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [activePlantId, setActivePlantId] = useState(plants[0]?.id || null);
  const [devices, setDevices] = useState([]);
  const [deviceVariables, setDeviceVariables] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceModelFile, setDeviceModelFile] = useState('');
  const [modelFiles, setModelFiles] = useState([]);
  const canEditDeviceName = user?.role === 'supervisor' || user?.role === 'administrador';

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Envie imagens .png, .jpg ou .svg.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Limite de 2 MB por arquivo.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedImages((prev) => [...prev, { name: file.name, url: previewUrl, size: file.size }]);
    setUploadError('');
  };

  const handleOpenScanner = () => {
    navigate('/scanner');
  };

  useEffect(() => {
    if (!activePlantId && plants.length) {
      setActivePlantId(plants[0].id);
    }
  }, [plants, activePlantId]);

  useEffect(() => {
    const loadDevices = async () => {
      if (!activePlantId) return;
      const response = await fetchJson(`/api/plants/${activePlantId}/devices`);
      const nextDevices = response?.data || [];
      setDevices(nextDevices);
      if (!selectedDeviceId && nextDevices.length) {
        setSelectedDeviceId(nextDevices[0].id);
      }
    };
    loadDevices();
  }, [activePlantId, selectedDeviceId]);

  useEffect(() => {
    const loadVariables = async () => {
      if (!selectedDeviceId) return;
      const response = await fetchJson(`/api/devices/${selectedDeviceId}/variables`);
      setDeviceVariables(response?.data || []);
    };
    loadVariables();
  }, [selectedDeviceId]);

  useEffect(() => {
    const loadModels = async () => {
      const response = await fetchJson('/api/models');
      setModelFiles(response?.data || []);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const device = devices.find((item) => item.id === selectedDeviceId);
    if (!device) return;
    setDeviceName(device.name || '');
    setDeviceModelFile(device.model_file || '');
  }, [devices, selectedDeviceId]);

  const handleDeviceSave = async () => {
    if (!selectedDeviceId) return;
    setSaveError('');
    const response = await fetchJson(`/api/devices/${selectedDeviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deviceName, model_file: deviceModelFile || null }),
    });
    if (!response) {
      setSaveError('Nao foi possivel salvar o device.');
    }
  };

  const handleVariableLabelChange = (variableId, nextLabel) => {
    setDeviceVariables((prev) =>
      prev.map((variable) =>
        variable.id === variableId ? { ...variable, label: nextLabel } : variable
      ),
    );
  };

  const handleVariableSave = async (variable) => {
    setSaveError('');
    const response = await fetchJson(`/api/devices/${selectedDeviceId}/variables/${variable.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: variable.label }),
    });
    if (!response) {
      setSaveError('Nao foi possivel salvar a variavel.');
    }
  };

  return (
    <main className="page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Onboarding</p>
            <h2>Cadastro de gateways e nós</h2>
          </div>
          <div className="badge primary">Wizard técnico</div>
        </div>
        <div className="grid two-col">
          <article className="card">
            <h3>Novo gateway</h3>
            <p className="muted">
              Adicione o IP/host para Modbus TCP ou a porta serial (COM) para Modbus RTU usando um conversor.
            </p>
            <button type="button" className="primary" onClick={handleOpenScanner}>
              Abrir scanner Modbus
            </button>
            <ul className="list" style={{ marginTop: '14px' }}>
              {plants.map((plant) => (
                <li key={plant.id}>
                  <div>
                    <strong>{plant.name}</strong>
                    <span className="micro">{plant.hostname}</span>
                  </div>
                  <span className={`pill ${plant.status}`}>{plant.status}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="card highlight">
            <div className="tag">Template Matching</div>
            <h3>Mapeamento Modbus</h3>
            <ul className="list">
              <li>Detecta automaticamente a família Carel pelo registrador de identidade.</li>
              <li>Carrega a lista de variáveis e imagem do equipamento.</li>
              <li>Permite editar offsets e unidades antes de publicar.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Mapeamento</p>
            <h2>Dispositivos e variáveis</h2>
          </div>
          <div className="badge neutral">Setup</div>
        </div>
        <div className="toolbar">
          <div className="toolbar-actions">
            <select
              className="select"
              value={activePlantId || ''}
              onChange={(e) => {
                setActivePlantId(Number(e.target.value));
                setSelectedDeviceId(null);
              }}
            >
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={selectedDeviceId || ''}
              onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
              disabled={devices.length === 0}
            >
              {devices.length === 0 && <option value="">Sem devices</option>}
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} (ID {device.modbus_id})
                </option>
              ))}
            </select>
          </div>
          {saveError && <span className="micro muted">{saveError}</span>}
        </div>
        {selectedDeviceId && (
          <div className="grid two-col" style={{ marginBottom: '16px' }}>
            <label>
              Nome do device
              <input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                disabled={!canEditDeviceName}
              />
            </label>
            <label>
              Modelo XML
              <select
                className="select"
                value={deviceModelFile || ''}
                onChange={(e) => setDeviceModelFile(e.target.value)}
                disabled={!canEditDeviceName || modelFiles.length === 0}
              >
                {modelFiles.length === 0 && <option value="">Sem modelos</option>}
                {modelFiles.map((file) => (
                  <option key={file} value={file}>
                    {file}
                  </option>
                ))}
              </select>
            </label>
            <div className="toolbar-actions">
              <button
                type="button"
                className="primary"
                onClick={handleDeviceSave}
                disabled={!canEditDeviceName}
              >
                Salvar device
              </button>
            </div>
          </div>
        )}
        {deviceVariables.length === 0 ? (
          <p className="muted">Nenhuma variável cadastrada para este device.</p>
        ) : (
          <div className="scan-table" role="table" aria-label="Variáveis do device">
            <div className="scan-row scan-header" role="row">
              <span>Code</span>
              <span>Nome</span>
              <span>Func</span>
              <span>Offset</span>
              <span>Tamanho</span>
              <span></span>
            </div>
            {deviceVariables.map((variable) => (
              <div key={variable.id} className="scan-row" role="row">
                <span>{variable.code}</span>
                <span>
                  <input
                    value={variable.label || ''}
                    onChange={(e) => handleVariableLabelChange(variable.id, e.target.value)}
                    disabled={!canEditDeviceName}
                  />
                </span>
                <span>{variable.function_code}</span>
                <span>{variable.offset}</span>
                <span>{variable.length}</span>
                <span>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => handleVariableSave(variable)}
                    disabled={!canEditDeviceName}
                  >
                    Salvar
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Biblioteca visual</p>
            <h2>Imagens dos controladores</h2>
            <p className="muted">
              Arquivos base estão em <code>frontend/public/images</code>. Substitua pelos PNGs das fotos acima (até 2MB) e mantenha a proporção original
              (paisagem para PJ/pRACK/pCO, retrato para MPX PRO/pCO mini) para evitar distorção.
            </p>
          </div>
          <div className="badge neutral">Supervisor</div>
        </div>

        <div className="component-gallery">
          {componentImages.map((component) => (
            <article key={component.key} className="component-card">
              <div className={`component-thumb ${component.orientation}`}>
                <img src={component.path} alt={`Imagem do ${component.name}`} loading="lazy" />
              </div>
              <div className="component-meta">
                <div className="component-title">{component.name}</div>
                <div className="micro">{component.note}</div>
                <div className="micro muted">Arquivo: {component.path}</div>
                <div className="micro muted">Dica: use a foto em alta (largura mínima 1200px) para preservar a nitidez.</div>
              </div>
            </article>
          ))}
        </div>

        <div className="upload-box">
          <div>
            <h3>Adicionar/atualizar imagem</h3>
            <p className="muted">
              Supervisores podem anexar novas fotos dos ativos. Tipos permitidos: .png, .jpg, .jpeg, .svg. Tamanho máximo: 2MB.
              Substitua o arquivo na pasta de imagens para uso definitivo.
            </p>
          </div>
          <div className="upload-actions">
            <label className="upload-input">
              <span>Selecionar imagem</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleImageUpload}
                aria-label="Enviar nova imagem do equipamento"
              />
            </label>
            {uploadError && <div className="error" role="status">{uploadError}</div>}
            {uploadedImages.length > 0 && (
              <div className="uploaded-list">
                <p className="micro muted">Imagens carregadas nesta sessão (visualização rápida):</p>
                <div className="uploaded-grid">
                  {uploadedImages.map((file) => (
                    <div key={file.url} className="uploaded-card">
                      <img src={file.url} alt={file.name} loading="lazy" />
                      <div className="micro">{file.name}</div>
                      <div className="micro muted">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                  ))}
                </div>
                <p className="micro muted">Obs.: uso apenas local. Para produção, subir o arquivo para o bucket/pasta compartilhada.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}

function ScannerPage({ onAddPlant, user, plants, refresh }) {
  const navigate = useNavigate();
  const ipHistoryKey = 'kryos.scan.ipHistory';
  const [form, setForm] = useState({
    name: 'Nova planta',
    host: 'localhost',
    port: '502',
    serverMapFile: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [validationError, setValidationError] = useState('');
  const [scanResults, setScanResults] = useState([]);
  const [scanSessionId, setScanSessionId] = useState(null);
  const [scanPending, setScanPending] = useState(false);
  const [scanError, setScanError] = useState('');
  const [ipHistory, setIpHistory] = useState([]);

  const parseHostname = (hostname) => {
    if (!hostname) return { host: '', port: '' };
    if (hostname.includes(':')) {
      const [host, port] = hostname.split(':', 2);
      return { host: host.trim(), port: port.trim() };
    }
    return { host: hostname.trim(), port: '' };
  };

  const loadIpHistory = () => {
    try {
      const raw = localStorage.getItem(ipHistoryKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  };

  const saveIpHistory = (next) => {
    try {
      localStorage.setItem(ipHistoryKey, JSON.stringify(next));
    } catch (_err) {
      // ignore storage issues
    }
  };

  const rememberIp = (value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return;
    const next = [trimmed, ...ipHistory.filter((ip) => ip !== trimmed)].slice(0, 10);
    setIpHistory(next);
    saveIpHistory(next);
  };

  useEffect(() => {
    if (!selectedPlantId && plants?.length) {
      setSelectedPlantId(String(plants[0].id));
    }
  }, [plants, selectedPlantId]);

  useEffect(() => {
    setIpHistory(loadIpHistory());
  }, []);

  useEffect(() => {
    if (!selectedPlantId) return;
    const plant = plants?.find((item) => String(item.id) === String(selectedPlantId));
    if (!plant) return;
    const { host, port } = parseHostname(plant.hostname || '');
    setForm((prev) => ({
      ...prev,
      name: plant.name || prev.name,
      host: host || prev.host,
      port: port || prev.port,
    }));
  }, [selectedPlantId, plants]);

  const handleScan = async () => {
    setScanPending(true);
    setScanError('');
    setScanResults([]);
    setScanSessionId(null);
    if (!form.host.trim()) {
      setScanError('Informe o IP/host do servidor Modbus.');
      setScanPending(false);
      return;
    }
    if (!selectedFile) {
      setScanError('Selecione o arquivo XML do servidor.');
      setScanPending(false);
      return;
    }
    rememberIp(form.host);
    
    const formData = new FormData();
    formData.append('xml_file', selectedFile);
    formData.append('host', form.host.trim());
    formData.append('port', String(form.port || 502));
    formData.append('plant_name', form.name || 'Planta');
    if (selectedPlantId) {
      formData.append('plant_id', String(selectedPlantId));
    }

    try {
      const response = await fetch('/api/scans/server-import-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const rawText = await response.text();
        const statusLine = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`;
        let detail = rawText || statusLine || 'Nao foi possivel importar o XML.';
        try {
          const parsed = JSON.parse(rawText || '{}');
          detail = parsed?.detail || rawText || statusLine;
        } catch (_err) {
          // keep rawText
        }
        setScanError(detail || 'Nao foi possivel importar o XML.');
        setScanPending(false);
        return;
      }

      const data = await response.json();
      setScanSessionId(data.session_id || null);
      setScanResults(data.devices || []);
      if (refresh) {
        refresh();
      }
    } catch (err) {
      setScanError(err?.message || 'Nao foi possivel importar o XML.');
    } finally {
      setScanPending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlantId) {
      navigate('/setup');
      return;
    }
    if (!form.name.trim()) {
      setValidationError('Defina um nome para identificar a planta.');
      return;
    }

    if (!form.host.trim()) {
      setValidationError('Informe o IP/host do servidor Modbus.');
      return;
    }

    const newPlant = {
      id: Date.now(),
      name: form.name.trim(),
      status: 'online',
      vpn_tunnel: 'Ativo',
      hostname: `${form.host}:${form.port || 502}`,
      health: 90,
      connection: {
        protocol: 'tcp',
        host: form.host,
        port: form.port,
      },
    };

    onAddPlant(newPlant);
    navigate('/setup');
  };

  return (
    <main className="page">
      {scanPending && (
        <div className="scan-overlay" role="status" aria-live="polite">
          <div className="scan-overlay-card">
            <div className="scan-spinner">
              <div className="scan-spinner-ring" />
              <div className="scan-spinner-dot" />
              <div className="scan-spinner-center">
                <strong>Importando</strong>
                <span className="micro muted">Lendo XML do servidor...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Scanner Modbus</p>
            <h2>Descoberta de dispositivos</h2>
          </div>
          <div className="panel-actions">
            <button type="button" className="ghost" onClick={() => navigate('/setup')}>
              Voltar ao setup
            </button>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Planta existente
            <select
              className="select"
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
            >
              <option value="">Nova planta</option>
              {plants?.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nome da planta
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <div className="grid two-col">
            <label>
              IP
              <input
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                placeholder="localhost"
                list="scan-ip-history"
                required
              />
              <datalist id="scan-ip-history">
                {ipHistory.map((ip) => (
                  <option key={ip} value={ip} />
                ))}
              </datalist>
            </label>
            <label>
              Porta TCP
              <input
                value={form.port}
                onChange={(e) => setForm({ ...form, port: e.target.value })}
                placeholder="502"
              />
            </label>
          </div>
          <label>
            Arquivo XML do servidor
            <input
              type="file"
              accept=".xml"
              onChange={(e) => setSelectedFile(e.target.files[0] || null)}
              required
            />
            {selectedFile && (
              <div className="micro muted" style={{ marginTop: '4px' }}>
                Arquivo selecionado: {selectedFile.name}
              </div>
            )}
          </label>

          {validationError && <div className="error">{validationError}</div>}
          <div className="scan-actions">
            <button type="button" className="primary" onClick={handleScan} disabled={scanPending}>
              {scanPending ? 'Importando...' : 'Importar XML'}
            </button>
            {scanError && <div className="error">{scanError}</div>}
            {scanSessionId && (
              <span className="micro muted">Sessao: {scanSessionId}</span>
            )}
          </div>
          {scanResults.length > 0 && (
            <div className="scan-results">
              <div className="scan-table" role="table" aria-label="Dispositivos importados">
                <div className="scan-row scan-header" role="row">
                  <span>Endereco</span>
                  <span>Device</span>
                  <span>Variaveis</span>
                </div>
                {scanResults.map((result) => (
                  <div key={result.device_id || `${result.unit_id}-${result.name}`} className="scan-row" role="row">
                    <span>{result.unit_id}</span>
                    <span>{result.name}</span>
                    <span>{result.variables}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {scanSessionId && scanResults.length === 0 && !scanPending && (
            <p className="muted">Nenhum device importado. Verifique o XML selecionado.</p>
          )}
          <div className="toolbar">
            <div className="micro muted">
              Salvando aqui já adiciona a planta na navegação e no dashboard para testes.
            </div>
            <div className="toolbar-actions">
              <button type="button" className="ghost" onClick={() => navigate('/setup')}>
                Cancelar
              </button>
              <button type="submit" className="primary">
                Registrar planta
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

function AdminPage() {
  return (
    <main className="page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Financeiro e notificações</p>
            <h2>Painel Administrativo</h2>
          </div>
          <div className="badge neutral">RBAC completo</div>
        </div>
        <div className="grid three-col">
          <article className="card">
            <div className="stat">
              <span className="label">Clientes ativos</span>
              <strong>42</strong>
            </div>
            <p className="muted">Planos enterprise e premium.</p>
          </article>
          <article className="card">
            <div className="stat">
              <span className="label">Churn 90d</span>
              <strong>1.8%</strong>
            </div>
            <p className="muted">Monitoramento semanal.</p>
          </article>
          <article className="card">
            <div className="stat">
              <span className="label">Envios de alerta</span>
              <strong>99.2%</strong>
            </div>
            <p className="muted">E-mail + push + webhook.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function AiPage() {
  const [code, setCode] = useState('ALM-018');
  const [description, setDescription] = useState('Alta temperatura de descarga');
  const [telemetry, setTelemetry] = useState('{"temperatura_descarga": 95, "setpoint": 70}');
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setPending(true);
    setResult(null);
    setError('');

    let parsedTelemetry = {};
    try {
      parsedTelemetry = telemetry ? JSON.parse(telemetry || '{}') : {};
    } catch (err) {
      setError('Telemetria inválida. Use JSON válido.');
      setPending(false);
      return;
    }

    const body = {
      alarm: { code, description },
      telemetry: parsedTelemetry,
    };

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const raw = await response.text();
        setError(raw || `Falha ao chamar IA (HTTP ${response.status}).`);
        setPending(false);
        return;
      }
      const data = await response.json();
      if (data?.source === 'stub') {
        setError('Chave OPENAI_API_KEY nao configurada ou invalida.');
      }
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Falha ao chamar IA.');
    }
    setPending(false);
  };

  return (
    <main className="page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Assistente</p>
            <h2>IA para alarmes</h2>
          </div>
          <div className="badge success">LLM + telemetria</div>
        </div>
        <div className="grid two-col">
          <article className="card">
            <h3>Fluxo</h3>
            <ol className="ordered">
              <li>Recebe alarme (código + descrição) e últimas leituras do dispositivo.</li>
              <li>Envia para o endpoint /api/ai/analyze que chama o modelo LLM.</li>
              <li>Devolve causa raiz sugerida e ação imediata, registrando no audit log.</li>
            </ol>
            <form className="form" onSubmit={handleAnalyze}>
              <label>
                Código
                <input value={code} onChange={(e) => setCode(e.target.value)} required />
              </label>
              <label>
                Descrição
                <input value={description} onChange={(e) => setDescription(e.target.value)} required />
              </label>
              <label>
                Telemetria (JSON)
                <textarea
                  value={telemetry}
                  onChange={(e) => setTelemetry(e.target.value)}
                  rows={4}
                  className="textarea"
                />
              </label>
              {error && <div className="error">{error}</div>}
              <button type="submit" className="primary" disabled={pending}>
                {pending ? 'Analisando...' : 'Enviar para IA'}
              </button>
            </form>
          </article>
          <article className="card highlight">
            <div className="tag">Resultado</div>
            {result ? (
              <div className="ai-result">
                <p className="micro muted">Fonte: {result.source}</p>
                <p><strong>Causa raiz:</strong> {result.root_cause}</p>
                <p><strong>Ação imediata:</strong> {result.action}</p>
              </div>
            ) : (
              <p className="muted">Envie um alarme para obter sugestão.</p>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}

function RequireAuth({ user, children }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function NavigationShowcase({ user }) {
  const location = useLocation();
  const routes = [
    { path: '/plants', label: 'Plantas' },
    { path: '/', label: 'Dashboard' },
    { path: '/setup', label: 'Setup' },
    { path: '/admin', label: 'Admin' },
    { path: '/ai', label: 'IA' },
  ];

  return (
    <div className="nav-showcase" aria-label="Navegação rápida">
      <div className="nav-showcase-header">
        <span className="eyebrow">Navegação</span>
        <span className="micro muted">{user ? 'Usuário autenticado' : 'Login necessário para as demais telas'}</span>
      </div>
      <div className="nav-showcase-actions">
        {routes.map((route) => (
          <Link key={route.path} to={route.path} className={location.pathname === route.path ? 'active' : ''}>
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function AppShell() {
  const [theme, setTheme] = useState('clean');
  const [user, setUser] = useState(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const {
    plants,
    devices,
    alarms,
    loading,
    refreshing,
    refresh,
    loadedOnce,
    hasDataSnapshot,
    snapshotUpdatedAt,
  } = useBackendData();
  const {
    dbReady,
    probeReady: backendProbeReady,
    checking: backendChecking,
    lastCheckedAt,
    reason: backendReason,
    dbPingMs,
  } = useBackendReadiness();
  const themeDescription = useMemo(() => themeOptions[theme]?.description, [theme]);
  const [activePlantId, setActivePlantId] = useState(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(activePlantStorageKey);
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  });
  const [customPlants, setCustomPlants] = useState([]);
  const [dashboardUnlocked, setDashboardUnlocked] = useState(false);
  const mergedPlants = useMemo(() => [...plants, ...customPlants], [plants, customPlants]);
  const hasRuntimeData = hasAnyBackendData(plants, devices, alarms);
  const gateByData = hasDataSnapshot || hasRuntimeData;
  const loginReady = dbReady || gateByData;
  const canRenderDashboard = dashboardUnlocked || loginReady;
  const dashboardLoadingMessage = backendChecking
    ? 'Conectando ao banco e carregando snapshot inicial...'
    : loadedOnce
      ? `Aguardando dados iniciais (${backendReason || 'sem resposta do backend'})...`
      : 'Preparando cache inicial de plantas e devices...';

  const handleSelectPlant = useCallback((plantId) => {
    const normalized = Number(plantId);
    if (!Number.isFinite(normalized)) return;
    setActivePlantId(normalized);
  }, []);

  const handleAddPlant = (plant) => {
    setCustomPlants((prev) => [...prev, plant]);
    handleSelectPlant(plant.id);
  };

  useEffect(() => {
    if (!mergedPlants.length) {
      setActivePlantId(null);
      return;
    }
    const hasCurrent = mergedPlants.some((plant) => Number(plant.id) === Number(activePlantId));
    if (hasCurrent) return;
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(activePlantStorageKey);
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && mergedPlants.some((plant) => Number(plant.id) === parsed)) {
        setActivePlantId(parsed);
        return;
      }
    }
    setActivePlantId(Number(mergedPlants[0].id));
  }, [mergedPlants, activePlantId]);

  useEffect(() => {
    const normalized = Number(activePlantId);
    if (!Number.isFinite(normalized)) return;
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(activePlantStorageKey, String(normalized));
  }, [activePlantId]);

  useEffect(() => {
    if (loginReady) {
      setDashboardUnlocked(true);
    }
  }, [loginReady]);

  return (
    <div className={`app theme-${theme}`}>
      <TopNav
        theme={theme}
        onThemeChange={setTheme}
        isThemeModalOpen={isThemeModalOpen}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onCloseThemeModal={() => setIsThemeModalOpen(false)}
        user={user}
      />
      <div className="theme-description">{themeDescription}</div>
      <NavigationShowcase user={user} />
      <Routes>
        <Route
          path="/login"
          element={(
            <LoginPage
              onLogin={setUser}
              backendReady={loginReady}
              backendChecking={backendChecking}
              backendCheckedAt={lastCheckedAt}
            />
          )}
        />
        <Route
          path="/plants"
          element={
            <RequireAuth user={user}>
              <MultiPlants
                plants={mergedPlants}
                devices={devices}
                alarms={alarms}
                onSelectPlant={handleSelectPlant}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/setup"
          element={
            <RequireAuth user={user}>
              <SetupPage plants={mergedPlants} user={user} />
            </RequireAuth>
          }
        />
        <Route
          path="/scanner"
          element={
            <RequireAuth user={user}>
              <ScannerPage onAddPlant={handleAddPlant} user={user} plants={mergedPlants} refresh={refresh} />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth user={user}>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/ai"
          element={
            <RequireAuth user={user}>
              <AiPage />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth user={user}>
              {canRenderDashboard ? (
                <PlantDashboard
                  plants={mergedPlants}
                  devices={devices}
                  alarms={alarms}
                  activePlantId={activePlantId}
                  onSelectPlant={handleSelectPlant}
                  loading={loading}
                  refreshing={refreshing}
                  refresh={refresh}
                  user={user}
                  backendReady={dbReady}
                  backendProbeReady={backendProbeReady}
                  backendReason={backendReason}
                  backendCheckedAt={lastCheckedAt}
                  snapshotUpdatedAt={snapshotUpdatedAt}
                  backendPingMs={dbPingMs}
                />
              ) : (
                <BackendLoadingScreen
                  title="Preparando dashboard"
                  message={dashboardLoadingMessage}
                />
              )}
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
