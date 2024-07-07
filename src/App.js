import {useForm} from "react-hook-form";
import axios from "axios";
import {useEffect, useState} from "react";
import "./App.css";
import "./broadcasts";

function App() {
    const [token, setToken] = useState('');
    const [messages, setMessages] = useState([]);
    const {register, handleSubmit, reset} = useForm();

    const submitHandler = async ({email, password}) => {
        try {
            const response = await axios.post('http://localhost/api/v1/users/login', {
                email: email,
                password: password,
            });
            localStorage.setItem('access_token', response.data?.access_token);

        } catch (error) {
            console.log(error);
        }
    };

    async function getMessages(chat_id) {
        const response = await axios.get(
            'http://localhost/api/v1/users/chats/' + chat_id,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        setMessages(response.data.data)
    }

    async function sendMessage({message}) {
        const response = await axios.post(
            `http://localhost/api/v1/users/chats/5/send`,
            {
                message
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        reset()
        getMessages(5)
    }

    async function refreshToken() {
        const response = await axios.post('http://localhost/api/v1/users/refresh', {
            token: localStorage.getItem('access_token'),
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        localStorage.setItem('access_token', response.data.access_token)
    }

    useEffect(() => {
        setToken(localStorage.getItem('access_token'));
        if (token) {
            getMessages(5);
        }

        window.Echo.private("chat")
            .listen("MessageSent", (e) => {
                setMessages([...messages, e.message])
            });

    }, [token]);


    return (
        <div className="w-full p-3 flex flex-col">
            {(token) ?
                (
                    <div className={"grid grid-cols-1 gap-3"}>
                        {messages.map((message, key) => (
                            <div key={key} className={message.type === 'input' ? "messages input" : "messages output"}>
                                <small className="text-gray-200 text-sm">{message.user}</small>
                                <div className="text-white text-base">
                                    {message?.message}
                                </div>
                                <small className={"text-gray-200 text-sm"}>
                                    {message.created}
                                </small>
                            </div>
                        ))}
                        <form onSubmit={handleSubmit(sendMessage)}
                              className={"flex items-center relative"}
                        >
                            <input
                                type="text"
                                className={"text-gray-400 p-3 border rounded-2xl w-full"}
                                {...register('message')}
                                placeholder={"Сообщение..."}
                            />
                            <div className="absolute right-3 top-auto bottom-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5"
                                     stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                                </svg>
                            </div>
                        </form>
                    </div>

                ) :
                (
                    <form
                        className="min-w-[320px] max-w-[430px] w-full bg-gray-100 shadow p-3 rounded-3xl flex flex-col"
                        onSubmit={handleSubmit(submitHandler)}>
                        <input
                            type="email"
                            className={"border rounded-xl p-3 w-full mb-3"}
                            placeholder={"Email"}
                            {...register('email')}
                        />
                        <input
                            type="password"
                            placeholder={"Пароль"}
                            className={"border rounded-xl p-3 w-full mb-3"}
                            {...register('password')}
                        />
                        <button
                            className={"cursor-pointer bg-cyan-400 text-cyan-950 font-semibold px-10 py-3 text-center rounded-2xl mx-auto text-base shadow"}
                            type="submit"
                            onClick={handleSubmit(submitHandler)}
                        >Авторизоваться
                        </button>
                    </form>
                )
            }
        </div>
    );
}

export default App;
