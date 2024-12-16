import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../services/AuthService.js";

const Login = () => {
    const navigate = useNavigate();

    const initialValues = {
        username: "",
        password: ""
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Это поле обязательно для заполнения!"),
        password: Yup.string().required("Это поле обязательно для заполнения!")
    });

    const handleLogin = (values, { setSubmitting, setStatus }) => {
        AuthService.login(values.username, values.password).then(
            () => {
                navigate("/");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setStatus({ message: resMessage });
            }
        ).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <h2 className="mt-3">Авторизация</h2>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            <div className="form-group mb-3">
                                <label htmlFor="username">Логин</label>
                                <Field
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    placeholder="Введите имя пользователя"
                                />
                                <ErrorMessage name="username" component="div" className="invalid-feedback d-block" />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="password">Пароль</label>
                                <Field
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Введите пароль"
                                />
                                <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
                            </div>

                            <div className="form-group mb-3">
                                <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    )}
                                    Войти
                                </button>
                            </div>

                            {status && status.message && (
                                <div className="form-group mb-3">
                                    <div className="alert alert-danger" role="alert">
                                        Неправильный логин или пароль
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                <div className="text-center mt-3">
                    <p>Еще нет аккаунта? <a href="/register">Зарегистрируйтесь!</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;