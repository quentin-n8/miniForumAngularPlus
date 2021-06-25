import { Message } from "./Message";
import { User } from "./User";

export interface Topic {
    id?: number;
    title: string;
    date: Date | number;
    author?: User;
    user?: User;
    messages?: Message[];
    content?: string;
}