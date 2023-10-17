import { defineStore } from "pinia";

//类型声明
export interface message_type {
    id?: number
    role: string,
    message: string,
    time: string,
    record?: string,
}

interface talkRecord_type {
    id?: string,
    title: string,
    data: string,
    image: string,
}

export const useTalkRoleStore = defineStore("talkRole", {
    state: () => ({
        talkHistory: [
        ] as talkRecord_type[],
        messages: [
        ] as message_type[],
        chatRole: '邱',
        isChat:true,
    }),
    actions: {
        setmessages(message: message_type) {
            this.messages.push(message);
        },
        setMessages(messages: message_type[]) {
            this.messages = messages;
        },
        setTalkHistory(talkHistory: talkRecord_type[]) {
            this.talkHistory = talkHistory;
        },
        changeRole(role: string){
            this.chatRole = role;
        },
        changeChat(isChat: boolean){
            this.isChat = isChat;
        }
    },
});