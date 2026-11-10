const USER_NAME_STORAGE_KEY = "call-up:username";

const useUserName = () => {
    const getUserName = () => {
        const storedUserName = localStorage.getItem(USER_NAME_STORAGE_KEY);
        return storedUserName || "";
    };

    const saveUserName = (userName: string) => {
        localStorage.setItem(USER_NAME_STORAGE_KEY, userName);
    };

    return {
        getUserName,
        saveUserName,
    };
};

export default useUserName;
