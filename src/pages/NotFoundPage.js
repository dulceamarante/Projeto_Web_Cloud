import React from 'react';
import { Link } from 'react-router-dom';


const NotFoundPage = () => {
  return (
    // Container principal da página centralizar o conteúdo
    <div style={{ 
      textAlign: 'center',    
      padding: '50px',        
      marginTop: '100px'       
    }}>
      <h1>404 - Página não encontrada</h1> 
      <p>A página que você procura não existe.</p> 
      
      // Link para voltar à página inicial com estilos personalizados 
      <Link to="/" style={{ 
        color: '#000', 
        textDecoration: 'underline' 
      }}>
        Voltar à página inicial
      </Link>
    </div>
  );
};


export default NotFoundPage;
