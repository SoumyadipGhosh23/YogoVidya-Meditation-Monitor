import axios from "axios";

interface userType {
  userName : string;
  email: string;
  password: string;
}

interface userTypeLogin {
  email: string;
  password: string;
}

export const registerUser = async (user: userType) => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await axios.post(
      `${API_URL}/api/v1/auth/register`,
      user,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    return response.data;

  } catch (error) {
    throw error
  }
};
export const loginUser = async (user: userTypeLogin) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  console.log(API_URL);
  const response = await axios.post(
    `${API_URL}/api/v1/auth/login`,
    user,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
