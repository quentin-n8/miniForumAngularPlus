import { Topic } from "./Topic";
import { User } from "./User";

export interface Message {
    id?: number;
    content: string;
    date: Date;
    author: User;
    topic: Topic;
}