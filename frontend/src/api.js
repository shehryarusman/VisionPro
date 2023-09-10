import axios from "axios";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

instance.interceptors.request.use(
    config => {
        const { data } = config;
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            params.append(key, data[key]);
        });
        config.data = params;
        return config;
    },
);

export default instance;
