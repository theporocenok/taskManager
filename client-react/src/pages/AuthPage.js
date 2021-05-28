import React, {useState, useContext} from 'react'
import {useRequest} from "../hooks/axios.hook";
import {AuthContext} from "../contextes/AuthContext";

export const AuthPage = () => {
  const {loading, request, error, clearError} = useRequest();
  const auth = useContext(AuthContext)
  const [form, setForm] = useState({
    login: '',
    password: '',
  });
  const changeFormHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  const loginHandler = async () => {
    try {
      clearError();
      let authData = await request('/auth/login', 'POST', {...form});
      auth.login(authData.token);
    } catch (e) {}
  }
  return (
    <div className="d-flex justify-content-center pt-5">
      <div className="border auth-form px-3 pt-3 pb-3">
        <h1 className="mb-4">Авторизация</h1>
        <form className="auth-form__inputs">
          <div className="mb-3">
            <label htmlFor="login" className="form-label">Логин</label>
            <input
              type="text"
              className="form-control"
              id="login"
              name="login"
              value={form.login}
              autoComplete="username"
              onChange={changeFormHandler}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              className="form-control"
              id="password"
              autoComplete="current-password"
              name="password"
              value={form.password}
              onChange={changeFormHandler}
            />
          </div>
          {error &&
            (<div id="authErr" className="form-text text-danger mb-3"><b>{error}</b></div>)
          }
        </form>
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={loginHandler}
          >
            Войти
          </button>
        )}
      </div>
    </div>
  )
}