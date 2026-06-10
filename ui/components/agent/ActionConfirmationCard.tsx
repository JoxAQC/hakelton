import React from 'react';
import { ShieldAlert, Check, X, Database } from 'lucide-react';

interface ActionConfirmationCardProps {
  pendingAction: {
    tool_name: string;
    parameters: any;
    explanation: string;
  };
  onConfirm: () => void;
  onReject: () => void;
}

export default function ActionConfirmationCard({ pendingAction, onConfirm, onReject }: ActionConfirmationCardProps) {
  if (!pendingAction) return null;

  return (
    <div style={{
      margin: '12px 0',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#F8FAFC',
      fontFamily: 'var(--sans)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#B45309' }}>
        <ShieldAlert size={20} />
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Confirmación Requerida</h4>
      </div>
      
      <p style={{ fontSize: '13px', color: '#334155', marginBottom: '12px', lineHeight: '1.4' }}>
        {pendingAction.explanation || 'El agente ha solicitado ejecutar una acción que modificará la base de datos.'}
      </p>

      <div style={{
        backgroundColor: '#1E293B',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        overflowX: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#94A3B8' }}>
          <Database size={14} />
          <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{pendingAction.tool_name}</span>
        </div>
        <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '12px', fontFamily: 'monospace' }}>
          {JSON.stringify(pendingAction.parameters, null, 2)}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onReject}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            color: '#475569',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <X size={16} /> Rechazar
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          <Check size={16} /> Ejecutar Acción
        </button>
      </div>
    </div>
  );
}
