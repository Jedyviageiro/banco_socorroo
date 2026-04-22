import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../components/useToast';
import api from '../../services/api';

const initialForm = {
  PacienteId: '',
  tipoSolicitacao: 'tipagem',
  componente: 'Concentrado Eritrocitario',
  grupoSanguineo: '',
  unidades: 1,
  urgencia: 'moderada',
  justificacaoClinica: '',
};

export function useBancoSangueData() {
  const toast = useToast();
  const [pacientes, setPacientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [{ data: pacientesData }, { data: pedidosData }] = await Promise.all([
        api.get('/pacientes'),
        api.get('/banco-sangue/pedidos'),
      ]);

      setPacientes(Array.isArray(pacientesData) ? pacientesData : []);
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
    } catch {
      toast.error('Nao foi possivel carregar os dados do banco de sangue.', 'Carga falhou');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadData]);

  const stats = useMemo(
    () => ({
      criticos: pedidos.filter((item) => item.urgencia === 'critica').length,
      prontos: pedidos.filter((item) => item.estado === 'pronto').length,
      pendentes: pedidos.filter((item) => item.estado === 'pendente').length,
      total: pedidos.length,
    }),
    [pedidos]
  );

  const pacienteAtual = useMemo(
    () => pacientes.find((item) => String(item.id) === String(form.PacienteId)),
    [pacientes, form.PacienteId]
  );

  const handleChange = useCallback(
    (key) => (event) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(initialForm);
  }, []);

  const submitPedido = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await api.post('/banco-sangue/pedidos', {
        ...form,
        PacienteId: Number(form.PacienteId),
        unidades: Number(form.unidades),
      });

      toast.success('Pedido do banco de sangue registado.', 'Banco de Sangue');
      resetForm();
      await loadData();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Nao foi possivel guardar o pedido.', 'Falha ao guardar');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [form, loadData, resetForm, toast]);

  return {
    form,
    handleChange,
    isLoading,
    isSubmitting,
    pacienteAtual,
    pacientes,
    pedidos,
    stats,
    submitPedido,
  };
}
