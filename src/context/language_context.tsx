import {createContext, ReactNode, useContext, useState} from "react";
import {text_content} from "../utils/text_content";

type TLanguage = (typeof text_content)[number]["id"];

interface LangContextType {
    language: TLanguage;
    setLanguage: (lang: TLanguage) => void;
}

const LangContext = createContext<LangContextType | null>(null);

export const LangProvider = ({children}: { children?: ReactNode }) => {
    const [language, setLanguage] = useState<TLanguage>(text_content[0].id);
    const langContent = text_content.find(l => l.id === language);

    return (
        <LangContext.Provider value={{language, setLanguage, langContent}}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => {
    const context = useContext(LangContext);
    if (!context) {
        throw new Error("useLang must be used within a LangProvider");
    }
    return context;
};