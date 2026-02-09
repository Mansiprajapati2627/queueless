// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const AdminAccess = ({ user }) => {
//   const navigate = useNavigate();

//   // This component adds hidden admin access buttons in the corner
//   if (user?.role === 'admin' || user?.role === 'kitchen') {
//     return null;
//   }

//   return (
//     <div style={{
//       position: 'fixed',
//       bottom: '100px',
//       right: '20px',
//       zIndex: 1000,
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '10px'
//     }}>
//       <button
//         onClick={() => navigate('/admin')}
//         style={{
//           width: '40px',
//           height: '40px',
//           borderRadius: '50%',
//           background: 'var(--primary)',
//           color: 'white',
//           border: 'none',
//           cursor: 'pointer',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '1rem',
//           boxShadow: 'var(--shadow-lg)',
//           opacity: '0.3',
//           transition: 'opacity 0.3s'
//         }}
//         onMouseEnter={(e) => e.target.style.opacity = '1'}
//         onMouseLeave={(e) => e.target.style.opacity = '0.3'}
//         title="Admin Access"
//       >
//         <i className="fas fa-crown"></i>
//       </button>
      
//       <button
//         onClick={() => navigate('/kitchen')}
//         style={{
//           width: '40px',
//           height: '40px',
//           borderRadius: '50%',
//           background: 'var(--secondary)',
//           color: 'white',
//           border: 'none',
//           cursor: 'pointer',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '1rem',
//           boxShadow: 'var(--shadow-lg)',
//           opacity: '0.3',
//           transition: 'opacity 0.3s'
//         }}
//         onMouseEnter={(e) => e.target.style.opacity = '1'}
//         onMouseLeave={(e) => e.target.style.opacity = '0.3'}
//         title="Kitchen Access"
//       >
//         <i className="fas fa-utensils"></i>
//       </button>
//     </div>
//   );
// };

// export default AdminAccess;