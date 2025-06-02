import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Estados para controlar os formulários
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false
  });

  // Estados para os dados dos formulários
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // Função para alternar visibilidade da password
  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Função para alternar entre login e signup
  const toggleForm = () => {
    setIsSignup(!isSignup);
    // Limpar dados quando muda de formulário
    setLoginData({ email: '', password: '', keepLoggedIn: false });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '', acceptTerms: false });
  };

  // Handle login form
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!loginData.email || !loginData.password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Simular login bem-sucedido
    const userData = {
      name: loginData.email.split('@')[0],
      email: loginData.email
    };

    localStorage.setItem('authToken', 'fake-token-123');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Disparar evento customizado para notificar o Header
    window.dispatchEvent(new Event('localStorageChange'));
    
    alert('Login realizado com sucesso!');
    navigate('/');
  };

  // Handle signup form
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    // Validações
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert('As palavras-passe não coincidem!');
      return;
    }

    if (!signupData.acceptTerms) {
      alert('Deve aceitar os termos e condições!');
      return;
    }

    if (signupData.password.length < 6) {
      alert('A palavra-passe deve ter pelo menos 6 caracteres!');
      return;
    }

    // Simular registo bem-sucedido e fazer login automático
    const userData = {
      name: signupData.name,
      email: signupData.email
    };

    localStorage.setItem('authToken', 'fake-token-123');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Disparar evento customizado para notificar o Header
    window.dispatchEvent(new Event('localStorageChange'));
    
    alert('Conta criada com sucesso!');
    navigate('/');
  };

  // Handle input changes
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Função para lidar com "Esqueceu-se da senha"
  const handleForgotPassword = () => {
    const email = prompt('Introduza o seu e-mail para recuperar a senha:');
    if (email && email.includes('@')) {
      alert(`Instruções de recuperação enviadas para ${email}`);
    } else if (email) {
      alert('Por favor, introduza um e-mail válido.');
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">
            {isSignup ? 'CRIAR CONTA' : 'INICIAR SESSÃO'}
          </h1>
        </div>

        {/* Formulário de Login */}
        {!isSignup && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="E-mail" 
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            
            <div className="form-group">
              <div className="password-wrapper">
                <input 
                  type={showPassword.login ? "text" : "password"}
                  name="password"
                  className="form-input" 
                  placeholder="Palavra-passe"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => togglePassword('login')}
                >
                  {showPassword.login ? '👁️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="keepLoggedIn" 
                name="keepLoggedIn"
                className="checkbox"
                checked={loginData.keepLoggedIn}
                onChange={handleLoginChange}
              />
              <label htmlFor="keepLoggedIn" className="checkbox-label">
                Manter a sessão iniciada
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Iniciar sessão
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={toggleForm}
            >
              Criar conta
            </button>

            <div className="auth-links">
              <button 
                type="button"
                className="auth-link" 
                onClick={handleForgotPassword}
              >
                Esqueceu-se da sua senha?
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Signup */}
        {isSignup && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="Nome completo" 
                value={signupData.name}
                onChange={handleSignupChange}
                required
              />
            </div>

            <div className="form-group">
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="E-mail" 
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </div>
            
            <div className="form-group">
              <div className="password-wrapper">
                <input 
                  type={showPassword.signup ? "text" : "password"}
                  name="password"
                  className="form-input" 
                  placeholder="Palavra-passe"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => togglePassword('signup')}
                >
                  {showPassword.signup ? '👁️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input 
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  className="form-input" 
                  placeholder="Confirmar palavra-passe"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => togglePassword('confirm')}
                >
                  {showPassword.confirm ? '👁️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="acceptTerms" 
                name="acceptTerms"
                className="checkbox" 
                checked={signupData.acceptTerms}
                onChange={handleSignupChange}
                required
              />
              <label htmlFor="acceptTerms" className="checkbox-label">
                Aceito os termos e condições
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Criar conta
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={toggleForm}
            >
              Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;