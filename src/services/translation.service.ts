import { BehaviorSubject } from "rxjs"
import fr from "../assets/locale/fr.json";
import en from "../assets/locale/en.json";

const defaultLanguage: BehaviorSubject<string> = new BehaviorSubject('fr');
export const currentLanguageValue = defaultLanguage.asObservable();
export const updateCurrentLanguage = (key: 'en' | 'fr') => defaultLanguage.next(key);

export const translationService = (currentLanguage:string, key: string) => {
  return (currentLanguage === 'en' ? en : fr as Record<string, string>)[key] || "no such key";
}
