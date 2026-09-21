import { useState } from "react";

const useHomePage = () => {
    const [code, setCode] = useState<string>("");

    return { code, setCode };
};

export default useHomePage;
