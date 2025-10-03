
const BASE_URL = "https://employee-ms-lqj5.vercel.app/";

export const getUser = async () => {
    const response = await fetch(`${BASE_URL}/api/users`);
    const json = await response.json();
    return json;
}
 