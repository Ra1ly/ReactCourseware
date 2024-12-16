import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../services/AuthService.js";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const initialValues = {
        username: "",
        email: "",
        password: ""
    };
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Это поле обязательно для заполнения!")
            .min(3, "Имя пользователя должно содержать от 3 до 20 символов.")
            .max(20, "Имя пользователя должно содержать от 3 до 20 символов."),
        email: Yup.string()
            .required("Это поле обязательно для заполнения!")
            .email("Это некорректный адрес электронной почты."),
        password: Yup.string()
            .required("Это поле обязательно для заполнения!")
            .min(6, "Пароль должен содержать от 6 до 40 символов.")
            .max(40, "Пароль должен содержать от 6 до 40 символов.")
    });

    const handleRegister = (values, { setSubmitting, setStatus }) => {
        AuthService.register(values.username, values.email, values.password).then(
            (response) => {
                setStatus({ success: true, message: response.data.message });
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setStatus({ success: false, message: resMessage });
            }
        ).finally(() => {
            setSubmitting(false);
            navigate("/login")
        });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <h2 className="mt-3">Регистрация</h2>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleRegister}
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
                                <label htmlFor="email">Email</label>
                                <Field
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    placeholder="a.a@post.by"
                                />
                                <ErrorMessage name="email" component="div" className="invalid-feedback d-block" />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
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
                                    Зарегистрироваться
                                </button>
                            </div>

                            {status && status.message && (
                                <div className="form-group mb-3">
                                    <div className={status.success ? "alert alert-success" : "alert alert-danger"} role="alert">
                                        {status.message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                <div className="text-center mt-3">
                    <p>Уже есть аккаунт? <a href="/login">Авторизуйтесь здесь!</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;