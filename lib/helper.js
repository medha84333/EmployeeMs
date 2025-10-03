
const BASE_URL = "https://employee-ms-i9so.vercel.app/";

export const getUser = async () => {
    const response = await fetch(`${BASE_URL}/api/users`);
    const json = await response.json();
    return json;
}
 