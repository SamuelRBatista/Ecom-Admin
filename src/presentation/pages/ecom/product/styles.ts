
import type { CSSProperties } from 'react';


interface Styles {
  [key: string]: CSSProperties;
}

const styles: Styles = {
  actionIcon: {
    marginRight: '10px',
    color: '#555',
    cursor: 'pointer',
  },

  actionIconDelete: {
    color: '#7e6560',
  },

  btn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },

  content: {
    position: 'relative',
    width: '120%',
    padding: '30px',
    display: 'grid',
    gridTemplateColumns: '4fr 1fr',
    gap: '50px',
    marginLeft: '15px',
  },

  recentOrders: {
    position: 'relative',
    display: 'grid',
    minHeight: '500px',
    background: 'var(--white)',
    padding: '20px',
    boxShadow: '0 7px 25px rgba(0, 0, 0, 0.08)',
    borderRadius: '20px',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontWeight: 600,
    color: 'var(--orange)',
  },

  btnNew: {
    position: 'relative',
    padding: '5px 10px',
    background: 'var(--orange)',
    textDecoration: 'none',
    color: 'var(--white)',
    borderRadius: '6px',
  },

  cadastroFormContainer: {
    width: '100%',
    // maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    top: 90,
  },

  title: {
    color: '#7e6560',
    textAlign: 'center',
    marginBottom: 20,
  },

  formGroup: {
    marginBottom: 20,
  },

  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
  },

  halfWidth: {
    flex: 1,
    minWidth: 220,
  },

  formControl: {
    flex: 1,
    width: '100%',
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
  },

  descriptionTextarea: {
    height: 100,
    resize: 'vertical',
  },

  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  btnSubmit: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },

  btnCancel: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#7e6560',
    color: '#fff',
    cursor: 'pointer',
  },

  errorText: {
    color: '#7e6560',
  },
};

export default styles;
